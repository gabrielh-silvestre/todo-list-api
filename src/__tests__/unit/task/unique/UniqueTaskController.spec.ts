import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ErrorStatusCode } from '../../../../@types/types';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { UniqueTaskUseCase } from '../../../../modules/tasks/useCases/uniqueTask/UniqueTaskUseCase';
import { UniqueTaskController } from '../../../../modules/tasks/useCases/uniqueTask/UniqueTaskController';

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
const uniqueTaskUseCase = new UniqueTaskUseCase(tasksRepository);
const uniqueTaskController = new UniqueTaskController(uniqueTaskUseCase);

describe('Test UniqueTaskController', () => {
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
    before(() => {
      useCaseStub = Sinon.stub(uniqueTaskUseCase, 'execute').resolves({
        statusCode: 'OK',
        data: null,
      });

      request.body = {
        title: MOCK_TASK.title,
        userId: MOCK_TASK.userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should call "next" middleware', () => {
      it('should call "next" middleware without args', async () => {
        await uniqueTaskController.handle(request, response, next.next);

        expect(spiedNext.calledWith()).to.be.true;
      });
    });
  });

  describe('Error case', () => {
    const ERROR_RESPONSE = new CustomError(
      ErrorStatusCode.CONFLICT,
      'Task already exists'
    );

    before(() => {
      useCaseStub = Sinon.stub(uniqueTaskUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

      request.body = {
        title: MOCK_TASK.title,
        userId: MOCK_TASK.userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should call "next" error middleware', () => {
      it('"next" should be called with CustomError as args', async () => {
        await uniqueTaskController.handle(request, response, next.next);

        expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
