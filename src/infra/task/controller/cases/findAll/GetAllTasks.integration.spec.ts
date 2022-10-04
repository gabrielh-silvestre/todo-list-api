import chai, { expect } from "chai";
import chaiHTTP from "chai-http";

import { TasksRepositoryInMemory } from "../../../../task/repository/memory/Task.repository";

import { tasks } from "../../../../../../__tests__/mocks/tasks";
import { app } from "../../../../api/app";

chai.use(chaiHTTP);

const LIST_TASKS_ENDPOINT = "/v1/api/tasks";

// const FAIL_SIGN_IN = new HttpError(
//   { statusCode: 401 },
//   "Expired or invalid token"
// );

describe('Test GET endpoint "/tasks"', function () {
  let token = "24d5ad6d-b864-4dee-a217-2608b6706cb6";

  beforeEach(() => {
    TasksRepositoryInMemory.populate(tasks as any);
  });

  afterEach(() => {
    TasksRepositoryInMemory.dump();
  });

  describe("Success case", () => {
    it("should return  a success status with all tasks", async () => {
      const response = await chai
        .request(app)
        .get(LIST_TASKS_ENDPOINT)
        .set("Authorization", token);

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an("array");

      expect(response.body[0]).to.be.an("object");
      expect(response.body[0]).to.have.property("id");
      expect(response.body[0]).to.have.property("title");
      expect(response.body[0]).to.have.property("description");
      expect(response.body[0]).to.have.property("status");
      expect(response.body[0]).to.have.property("updatedAt");
      expect(response.body[0]).to.not.have.property("userId");
    });
  });

  describe("Error cases", () => {
    // describe('Invalid "authorization" cases', () => {
    //   it("should not update a task without authorization", async () => {
    //     const response = await chai.request(app).get(LIST_TASKS_ENDPOINT);

    //     expect(response.status).to.be.equal(401);
    //     expect(response.body).to.have.property("message");
    //     expect(response.body.message).to.be.equal("No authorization header");
    //   });

    //   it("should not update a task with invalid authorization", async () => {
    //     const response = await chai
    //       .request(app)
    //       .get(LIST_TASKS_ENDPOINT)
    //       .set("Authorization", "invalid-token");

    //     expect(response.status).to.be.equal(401);
    //     expect(response.body).to.have.property("message");
    //     expect(response.body.message).to.be.equal("Expired or invalid token");
    //   });
    // });
  });
});
