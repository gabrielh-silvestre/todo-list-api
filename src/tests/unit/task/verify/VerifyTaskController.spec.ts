import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';
import { IError } from '../../../../@types/interfaces';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { VerifyTaskUseCase } from '../../../../modules/tasks/useCases/verifyTask/VerifyTaskUseCase';
import { VerifyTaskController } from '../../../../modules/tasks/useCases/verifyTask/VerifyTaskController';

const MOCK_TASK: Task = {
  id: '5',
  title: 'Task 5',
  description: 'Description 5',
  status: 'TODO',
  userId: '1',
  updatedAt: new Date(),
};

const tasksRepository = new TasksRepository();
const verifyTaskUseCase = new VerifyTaskUseCase(tasksRepository);
const verifyTaskController = new VerifyTaskController(verifyTaskUseCase);

describe('Test VerifyTaskController', () => {
  let useCaseStub: Sinon.SinonStub;
  let spiedStatus: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  let spiedNext: Sinon.SinonSpy;
  const next: NextFunction = () => {};

  before(() => {
    spiedStatus = Sinon.spy(response, 'status');
    spiedJson = Sinon.spy(response, 'json');
    spiedNext = Sinon.spy(next);
  });

  after(() => {
    spiedStatus.restore();
    spiedJson.restore();
  });

  describe('Success case', () => {
    const { userId, id } = MOCK_TASK;

    before(() => {
      useCaseStub = Sinon.stub(verifyTaskUseCase, 'execute').resolves({
        statusCode: 'OK',
        data: null,
      });

      request.body = {
        userId,
      };

      request.params = {
        id,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
      request.params = {};
    });

    describe('Should call "next" middleware', () => {
      it('should call "next" middleware without args', async () => {
        await verifyTaskController.handle(request, response, next);

        expect(spiedNext.args).to.be.empty;
      });
    });
  });

  describe('Error case', () => {
    const { userId, id } = MOCK_TASK;
    const ERROR_RESPONSE: IError = {
      statusCode: 'NOT_FOUND',
      message: 'Task not found',
    };

    before(() => {
      useCaseStub = Sinon.stub(verifyTaskUseCase, 'execute').resolves({
        statusCode: 'NOT_FOUND',
        message: 'Task not found',
      });

      request.body = {
        userId,
      };

      request.params = {
        id,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
      request.params = {};
    });

    describe('Should return a response with an error status and message', () => {
      it('response status should be 404', async () => {
        await verifyTaskController.handle(request, response, next);

        expect(spiedStatus.calledWith(404)).to.be.true;
      });

      it('response body should be an error message "Task not found"', () => {
        const { message } = ERROR_RESPONSE;
        verifyTaskController.handle(request, response, next);

        expect(spiedJson.calledWith({ message })).to.be.true;
      });
    });
  });
});
