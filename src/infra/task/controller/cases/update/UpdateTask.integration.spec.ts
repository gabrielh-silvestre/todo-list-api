import { HttpError } from "restify-errors";

import Sinon from "sinon";
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";

import { AuthService } from "../../../../../shared/services/Auth";
import { TasksRepositoryInMemory } from "@infra/task/repository/memory/Task.repository";

import { users } from "../../../../../../__tests__/mocks/users";
import { newTask, tasks } from "../../../../../../__tests__/mocks/tasks";
import { app } from "@infra/api/app";

chai.use(chaiHTTP);

const [{ id: taskId }] = tasks;
const [{ id, email, username }] = users;
const { title, description, status, userId } = newTask;

const FAIL_SIGN_IN = new HttpError(
  { statusCode: 401 },
  "Expired or invalid token"
);

describe('Test PUT endpoint "/tasks/:id', function () {
  let token = "fakeToken";
  let getUserAuthStub: Sinon.SinonStub;

  beforeEach(() => {
    getUserAuthStub = Sinon.stub(AuthService.prototype, "getUser");
    getUserAuthStub.resolves({ id, username, email });

    TasksRepositoryInMemory.populate(tasks as any);
  });

  afterEach(() => {
    getUserAuthStub.restore();

    TasksRepositoryInMemory.dump();
  });

  describe("Success case", () => {
    it("should return a success status with the updated task", async () => {
      const response = await chai
        .request(app)
        .put(`/v1/api/tasks/${taskId}`)
        .set("Authorization", token)
        .send({ title, description, status: "DONE" });

      expect(response).to.have.status(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("title");
      expect(response.body).to.have.property("description");
      expect(response.body).to.have.property("status");
      expect(response.body).to.have.property("updatedAt");
      expect(response.body).to.not.have.property("userId");
    });
  });

  describe("Error cases", () => {
    describe('Invalid "authorization" cases', () => {
      it("should not update a task without authorization", async () => {
        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .send({ title, description, status });

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal("No authorization header");
      });

      it("should not update a task with invalid authorization", async () => {
        getUserAuthStub.rejects(FAIL_SIGN_IN);

        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .set("Authorization", "invalid-token")
          .send({ title, description, status });

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal("Expired or invalid token");
      });
    });

    describe('Invalid "title" cases', () => {
      it("should not update a task without title", async () => {
        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .set("Authorization", token)
          .send({ description, status });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal('"title" is required');
      });

      it("should not update a task when title has less than 5 characters", async () => {
        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .set("Authorization", token)
          .send({ title: "test", description, status });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal(
          '"title" length must be at least 5 characters long'
        );
      });

      it("should not update a task when title has more than 20 characters", async () => {
        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .set("Authorization", token)
          .send({ title: "test".repeat(21), description, status });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal(
          '"title" length must be less than or equal to 20 characters long'
        );
      });
    });

    describe('Invalid "description" cases', () => {
      it("should not update a task without description", async () => {
        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .set("Authorization", token)
          .send({ title, status });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal('"description" is required');
      });

      it("should not update a task when description has more than 120 characters", async () => {
        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .set("Authorization", token)
          .send({ title, description: "test".repeat(121), status });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal(
          '"description" length must be less than or equal to 120 characters long'
        );
      });
    });

    describe('Invalid "status" cases', () => {
      it("should not update a task without status", async () => {
        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .set("Authorization", token)
          .send({ title, description });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal('"status" is required');
      });

      it("should not update a task with invalid status", async () => {
        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .set("Authorization", token)
          .send({ title, description, status: "INVALID" });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal(
          '"status" must be one of [TODO, IN_PROGRESS, DONE]'
        );
      });
    });

    describe('Invalid "other fields" cases', () => {
      it('should not update a task when gives other fields than "title" and "description"', async () => {
        const response = await chai
          .request(app)
          .put(`/v1/api/tasks/${taskId}`)
          .set("Authorization", token)
          .send({ title, description, status, userId, updatedAt: "invalid" });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal('"updatedAt" is not allowed');
      });
    });

    describe('"Non-existent" task case', () => {
      it("should not update a task when task does not exist", async () => {
        const response = await chai
          .request(app)
          .put("/v1/api/tasks/40")
          .set("Authorization", token)
          .send({ title, description, status });

        expect(response.status).to.be.equal(404);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.equal("Task not found");
      });
    });
  });
});
