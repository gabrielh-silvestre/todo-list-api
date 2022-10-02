import { HttpError } from "restify-errors";

import Sinon from "sinon";
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";

import { AuthService } from "../../../src/shared/services/Auth";
import { TasksRepositoryInMemory } from "../../../src/infra/task/repository/memory/Task.repository";

import { users } from "../../mocks/users";
import { app } from "../../../src/infra/api/app";
import { tasks } from "../../mocks/tasks";

chai.use(chaiHTTP);

const [{ id: taskId }] = tasks;
const [{ id, email, username }] = users;

const FAIL_SIGN_IN = new HttpError(
  { statusCode: 401 },
  "Expired or invalid token"
);

describe('Test DELETE endpoint "/tasks/:id"', function () {
  let token = "fakeToken";
  let getUserAuthStub: Sinon.SinonStub;

  beforeEach(() => {
    getUserAuthStub = Sinon.stub(AuthService.prototype, "getUser");
    getUserAuthStub.resolves({ id, username, email });

    TasksRepositoryInMemory.populate(tasks);
  });

  afterEach(() => {
    getUserAuthStub.restore();

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
    describe('Invalid "authorization" cases', () => {
      it("should not delete a task without authorization", async () => {
        const response = await chai
          .request(app)
          .delete(`/v1/api/tasks/${taskId}`);

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal("No authorization header");
      });

      it("should not delete a task with invalid authorization", async () => {
        getUserAuthStub.rejects(FAIL_SIGN_IN);

        const response = await chai
          .request(app)
          .delete(`/v1/api/tasks/${taskId}`)
          .set("Authorization", "invalid-token");

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal("Expired or invalid token");
      });
    });

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
