import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { VerifyTaskUseCase } from '../../../../modules/tasks/useCases/verifyTask/VerifyTaskUseCase';
import { VerifyTaskController } from '../../../../modules/tasks/useCases/verifyTask/VerifyTaskController';

import { CustomError } from '../../../../utils/CustomError';

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
  const next = {
    next: (args) => {},
  } as { next: NextFunction };

  before(() => {
    spiedStatus = Sinon.spy(response, 'status');
    spiedJson = Sinon.spy(response, 'json');
    spiedNext = Sinon.spy(next, 'next');
  });

  after(() => {
    spiedStatus.restore();
    spiedJson.restore();
    spiedNext.restore();
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
        await verifyTaskController.handle(request, response, next.next);

        expect(spiedNext.calledWith()).to.be.true;
      });
    });
  });

  describe('Error case', () => {
    const { userId, id } = MOCK_TASK;
    const ERROR_RESPONSE = new CustomError('NOT_FOUND', 'Task not found');

    before(() => {
      useCaseStub = Sinon.stub(verifyTaskUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

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

    describe('Should call "next" error middleware', () => {
      it('"next" should be called with CustomError as args', async () => {
        await verifyTaskController.handle(request, response, next.next);

        expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
