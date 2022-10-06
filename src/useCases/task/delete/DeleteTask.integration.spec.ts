import { expect } from "chai";

import { TasksRepositoryInMemory } from "../../../infra/task/repository/memory/Task.repository";
import { DeleteTaskUseCase } from "./DeleteTaskUseCase";

import { newTask } from "../../../../__tests__/mocks/tasks";

const { id, userId } = newTask;

const taskRepositoryInMemory = new TasksRepositoryInMemory();
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepositoryInMemory);

describe("Test DeleteTaskUseCase", () => {
  before(() => {
    taskRepositoryInMemory.create(newTask as any);
  });

  describe("Success case", () => {
    it("should return a object with an status code and data", async () => {
      const response = await deleteTaskUseCase.execute({ userId, id });

      expect(response).to.be.undefined;
    });
  });

  describe("Error case", () => {
    describe('Invalid "task id" case', () => {
      it("should throw an error with status code and message", async () => {
        try {
          await deleteTaskUseCase.execute({ userId, id });
          expect.fail("Should throw a not found error");
        } catch (error) {
          const e = error as any;

          expect(e).to.be.an("object");
          expect(e).to.have.property("statusCode");
          expect(e).to.have.property("message");

          expect(e.statusCode).to.be.equal(404);
          expect(e.message).to.be.equal("Task not found");
        }
      });
    });
  });
});
