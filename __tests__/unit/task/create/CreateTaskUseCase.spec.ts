import { expect } from "chai";

import { TasksRepositoryInMemory } from "../../../../src/infra/task/repository/memory/Task.repository";
import { CreateTaskUseCase } from "../../../../src/useCases/task/create/CreateTaskUseCase";

import { newTask } from "../../../mocks/tasks";

const createTaskUseCase = new CreateTaskUseCase(new TasksRepositoryInMemory());

describe("Test CreateTaskUseCase", () => {
  describe("Success case", () => {
    describe("Create test with description", () => {
      it("should return a object with an status code and data", async () => {
        const response = await createTaskUseCase.execute(newTask);

        expect(response).to.be.an("object");
        expect(response).to.have.property("statusCode");
        expect(response).to.have.property("data");

        expect(response.statusCode).to.be.equal(201);
        expect(response.data).to.be.an("object");

        expect(response.data).to.have.property("id");
        expect(response.data).to.have.property("title");
        expect(response.data).to.have.property("description");
        expect(response.data).to.have.property("status");
        expect(response.data).to.have.property("updatedAt");
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
        expect(response).to.have.property("statusCode");
        expect(response).to.have.property("data");

        expect(response.statusCode).to.be.equal(201);
        expect(response.data).to.be.an("object");

        expect(response.data).to.have.property("id");
        expect(response.data).to.have.property("title");
        expect(response.data).to.have.property("description");
        expect(response.data).to.have.property("status");
        expect(response.data).to.have.property("updatedAt");
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
          expect(error).to.have.property("statusCode");
          expect(error).to.have.property("message");

          expect(error.statusCode).to.be.equal(409);
          expect(error.message).to.be.equal(
            "Task with this title already exists"
          );
        }
      });
    });
  });
});
