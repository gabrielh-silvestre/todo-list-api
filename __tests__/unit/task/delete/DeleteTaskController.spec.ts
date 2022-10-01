import { NextFunction, request, response } from "express";

import { expect } from "chai";
import Sinon from "sinon";

import {
  deleteTaskUseCase,
  deleteTaskController,
} from "../../../../src/useCases/task/delete";

import { newTask } from "../../../mocks/tasks";

const { id, userId } = newTask;

const SUCCESS_RESPONSE = undefined;

const ERROR_RESPONSE = new Error("Test error");

describe("Test DeleteTaskController", () => {
  let useCaseStub: Sinon.SinonStub;
  let spiedStatus: Sinon.SinonSpy;
  let spiedEnd: Sinon.SinonSpy;
  let spiedNext: Sinon.SinonSpy;
  const next = {
    next: () => {},
  } as { next: NextFunction };

  before(() => {
    spiedStatus = Sinon.spy(response, "status");
    spiedEnd = Sinon.spy(response, "end");
    spiedNext = Sinon.spy(next, "next");
  });

  after(() => {
    spiedStatus.restore();
    spiedEnd.restore();
    spiedNext.restore();
  });

  describe("Success case", () => {
    before(() => {
      useCaseStub = Sinon.stub(deleteTaskUseCase, "execute");
      useCaseStub.resolves(SUCCESS_RESPONSE);

      request.params = { id };
      request.body = { userId };
    });

    after(() => {
      useCaseStub.restore();
    });

    it("should return an response with status 204 and no body", async () => {
      await deleteTaskController.handle(request, response, next.next);

      expect(spiedStatus.calledWith(204)).to.be.true;
      expect(spiedEnd.called).to.be.true;
    });
  });

  describe("Error case", () => {
    before(() => {
      useCaseStub = Sinon.stub(deleteTaskUseCase, "execute");
      useCaseStub.rejects(ERROR_RESPONSE);

      request.params = { id };
      request.body = { userId };
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should call "next" error middleware', async () => {
      await deleteTaskController.handle(request, response, next.next);

      expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
    });
  });
});
