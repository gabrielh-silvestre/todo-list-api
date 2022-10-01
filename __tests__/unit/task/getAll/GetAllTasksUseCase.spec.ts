import { expect } from "chai";
import Sinon from "sinon";

import { TasksRepositoryInMemory } from "../../../../src/infra/task/repository/memory/Task.repository";
import { GetAllTasksUseCase } from "../../../../src/modules/tasks/useCases/getAllTasks/GetAllTasksUseCase";

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

      expect(response).to.be.an("object");
      expect(response).to.have.property("statusCode");
      expect(response).to.have.property("data");

      expect(response.statusCode).to.be.equal(200);
      expect(response.data).to.be.an("array");

      expect(response.data[0]).to.be.an("object");
      expect(response.data[0]).to.have.property("id");
      expect(response.data[0]).to.have.property("title");
      expect(response.data[0]).to.have.property("description");
      expect(response.data[0]).to.have.property("status");
      expect(response.data[0]).to.have.property("updatedAt");
    });
  });
});
