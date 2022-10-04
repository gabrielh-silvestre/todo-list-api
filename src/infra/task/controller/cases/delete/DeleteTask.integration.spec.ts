import chai, { expect } from "chai";
import chaiHTTP from "chai-http";

import { TasksRepositoryInMemory } from "../../../../task/repository/memory/Task.repository";

import { tasks } from "../../../../../../__tests__/mocks/tasks";
import { app } from "../../../../api/app";

chai.use(chaiHTTP);

const [{ id: taskId }] = tasks;

// const FAIL_SIGN_IN = new HttpError(
//   { statusCode: 401 },
//   "Expired or invalid token"
// );

describe('Test DELETE endpoint "/tasks/:id"', function () {
  let token = "24d5ad6d-b864-4dee-a217-2608b6706cb6";

  beforeEach(() => {
    TasksRepositoryInMemory.populate(tasks as any);
  });

  afterEach(() => {
    TasksRepositoryInMemory.dump();
  });

  describe("Success case", () => {
    it("should return a success response with status and empty body", async () => {
      const response = await chai
        .request(app)
        .delete(`/v1/api/tasks/${taskId}`)
        .set("Authorization", token);

      expect(response.status).to.equal(204);
      expect(response.body).to.be.empty;
    });
  });

  describe("Error cases", () => {
    // describe('Invalid "authorization" cases', () => {
    //   it("should not delete a task without authorization", async () => {
    //     const response = await chai
    //       .request(app)
    //       .delete(`/v1/api/tasks/${taskId}`);

    //     expect(response.status).to.be.equal(401);
    //     expect(response.body).to.have.property("message");
    //     expect(response.body.message).to.be.equal("No authorization header");
    //   });

    //   it("should not delete a task with invalid authorization", async () => {
    //     const response = await chai
    //       .request(app)
    //       .delete(`/v1/api/tasks/${taskId}`)
    //       .set("Authorization", "invalid-token");

    //     expect(response.status).to.be.equal(401);
    //     expect(response.body).to.have.property("message");
    //     expect(response.body.message).to.be.equal("Expired or invalid token");
    //   });
    // });

    describe('"Non-existent" task case', () => {
      it("should not delete a task when task does not exist", async () => {
        const response = await chai
          .request(app)
          .delete("/v1/api/tasks/40")
          .set("Authorization", token);

        expect(response.status).to.be.equal(404);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal("Task not found");
      });
    });
  });
});
