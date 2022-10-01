import { expect } from "chai";

import { TasksRepositoryInMemory } from "../../../../src/infra/task/repository/memory/Task.repository";
import { UpdateTaskUseCase } from "../../../../src/useCases/task/update/UpdateTaskUseCase";

import { newTask, tasks } from "../../../mocks/tasks";

const [foundTask] = tasks;
const { title, description, status, userId } = newTask;

const taskRepositoryInMemory = new TasksRepositoryInMemory();
const updateTaskUseCase = new UpdateTaskUseCase(taskRepositoryInMemory);

describe("Test UpdateTaskUseCase", () => {
  before(() => {
    tasks.forEach((task) => taskRepositoryInMemory.create(task));
  });

  describe("Success case", () => {
    describe("should return a object with status code and data", async () => {
      const response = await updateTaskUseCase.execute({
        userId: foundTask.userId,
        id: foundTask.id,
        title,
        description,
        status,
      });

      expect(response).to.be.an("object");
      expect(response).to.have.property("statusCode");
      expect(response).to.have.property("data");

      expect(response.statusCode).to.be.equal(200);
      expect(response.data).to.be.an("object");

      expect(response.data).to.have.property("id");
      expect(response.data).to.have.property("title");
      expect(response.data).to.have.property("description");
      expect(response.data).to.have.property("status");
      expect(response.data).to.have.property("updatedAt");
    });
  });

  describe("Error case", () => {
    describe('Invalid "task id" case', () => {
      it("should throw an error with status code and message", async () => {
        try {
          await updateTaskUseCase.execute({
            userId,
            id: "invalid id",
            title,
            description,
            status,
          });
          expect.fail("Should throw a error");
        } catch (error) {
          expect(error).to.have.property("statusCode");
          expect(error).to.have.property("message");

          expect(error.statusCode).to.be.equal(404);
          expect(error.message).to.be.equal("Task not found");
        }
      });
    });
  });
});
