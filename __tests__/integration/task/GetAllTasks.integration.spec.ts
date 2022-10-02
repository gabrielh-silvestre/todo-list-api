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

const [{ id, email, username }] = users;

const LIST_TASKS_ENDPOINT = "/v1/api/tasks";

const FAIL_SIGN_IN = new HttpError(
  { statusCode: 401 },
  "Expired or invalid token"
);

describe('Test GET endpoint "/tasks"', function () {
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
    describe('Invalid "authorization" cases', () => {
      it("should not update a task without authorization", async () => {
        const response = await chai.request(app).get(LIST_TASKS_ENDPOINT);

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal("No authorization header");
      });

      it("should not update a task with invalid authorization", async () => {
        getUserAuthStub.rejects(FAIL_SIGN_IN);

        const response = await chai
          .request(app)
          .get(LIST_TASKS_ENDPOINT)
          .set("Authorization", "invalid-token");

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal("Expired or invalid token");
      });
    });
  });
});
