import { expect } from "chai";

import { TasksRepositoryInMemory } from "@infra/task/repository/memory/Task.repository";
import { UpdateTaskUseCase } from "./UpdateTaskUseCase";

import { newTask, tasks } from "../../../../__tests__/mocks/tasks";

const [foundTask] = tasks;
const { title, description, status, userId } = newTask;

const taskRepositoryInMemory = new TasksRepositoryInMemory();
const updateTaskUseCase = new UpdateTaskUseCase(taskRepositoryInMemory);

describe("Test UpdateTaskUseCase", () => {
  before(() => {
    tasks.forEach((task: any) => taskRepositoryInMemory.create(task));
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

      expect(response).to.have.property("id");
      expect(response).to.have.property("title");
      expect(response).to.have.property("description");
      expect(response).to.have.property("status");
      expect(response).to.have.property("updatedAt");
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
          const e = error as any;

          expect(e).to.have.property("statusCode");
          expect(e).to.have.property("message");

          expect(e.statusCode).to.be.equal(404);
          expect(e.message).to.be.equal("Task not found");
        }
      });
    });
  });
});
