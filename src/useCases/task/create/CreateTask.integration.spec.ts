import { expect } from "chai";

import { TasksRepositoryInMemory } from "@infra/task/repository/memory/Task.repository";
import { CreateTaskUseCase } from "./CreateTaskUseCase";

import { newTask } from "../../../../__tests__/mocks/tasks";

const createTaskUseCase = new CreateTaskUseCase(new TasksRepositoryInMemory());

describe("Test CreateTaskUseCase", () => {
  describe("Success case", () => {
    describe("Create test with description", () => {
      it("should return a object with an status code and data", async () => {
        const response = await createTaskUseCase.execute(newTask);

        expect(response).to.be.an("object");

        expect(response).to.have.property("id");
        expect(response).to.have.property("title");
        expect(response).to.have.property("description");
        expect(response).to.have.property("status");
        expect(response).to.have.property("updatedAt");
      });
    });

    describe("Create test without description", () => {
      it("should return a object with an status code and data", async () => {
        const response = await createTaskUseCase.execute({
          ...newTask,
          description: null,
          title: "Title 2",
        });

        expect(response).to.be.an("object");

        expect(response).to.have.property("id");
        expect(response).to.have.property("title");
        expect(response).to.have.property("description");
        expect(response).to.have.property("status");
        expect(response).to.have.property("updatedAt");
      });
    });
  });

  describe("Error case", () => {
    describe('Invalid "title" case', () => {
      it("should throw an error with status code and message", async () => {
        try {
          await createTaskUseCase.execute(newTask);
          expect.fail("Should throw a conflict error");
        } catch (error) {
          const e = error as any;

          expect(e).to.have.property("statusCode");
          expect(e).to.have.property("message");

          expect(e.statusCode).to.be.equal(409);
          expect(e.message).to.be.equal("Task with this title already exists");
        }
      });
    });
  });
});
