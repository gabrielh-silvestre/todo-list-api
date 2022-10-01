import { expect } from "chai";

import { TasksRepositoryInMemory } from "../../../../src/infra/task/repository/memory/Task.repository";
import { GetAllTasksUseCase } from "../../../../src/useCases/task/findAll/GetAllTasksUseCase";

import { tasks } from "../../../mocks/tasks";

const [{ userId }] = tasks;

const taskRepositoryInMemory = new TasksRepositoryInMemory();
const getAllTasksUseCase = new GetAllTasksUseCase(taskRepositoryInMemory);

describe("Test GetAllTasksUseCase", () => {
  before(() => {
    tasks.forEach((task) => taskRepositoryInMemory.create(task));
  });

  describe("Success case", () => {
    it("should return a object with an status code and data", async () => {
      const response = await getAllTasksUseCase.execute({ userId });

      expect(response).to.be.an("array");
      expect(response[0]).to.be.an("object");
      expect(response[0]).to.have.property("id");
      expect(response[0]).to.have.property("title");
      expect(response[0]).to.have.property("description");
      expect(response[0]).to.have.property("status");
      expect(response[0]).to.have.property("updatedAt");
    });
  });
});
