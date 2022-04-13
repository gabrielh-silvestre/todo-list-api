import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';
import { IError, ISuccess } from '../../../../@types/interfaces';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { UniqueTaskUseCase } from '../../../../modules/tasks/useCases/uniqueTitle/UniqueTaskUseCase';
import { UniqueTaskController } from '../../../../modules/tasks/useCases/uniqueTitle/UniqueTaskController';

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
  let spiedStatus: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  let useCaseStub: Sinon.SinonStub;
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
        await uniqueTaskController.handle(request, response, next);

        expect(spiedNext.args).to.be.empty;
      });
    });
  });

  describe('Error case', () => {
    const ERROR_RESPONSE: IError = {
      statusCode: 'CONFLICT',
      message: 'Task already exists',
    };

    before(() => {
      useCaseStub = Sinon.stub(uniqueTaskUseCase, 'execute').resolves({
        statusCode: 'CONFLICT',
        message: 'Task already exists',
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

    describe('Should return a response with an error status and message', () => {
      it('response status should be 409', async () => {
        await uniqueTaskController.handle(request, response, next);

        expect(spiedStatus.calledWith(409)).to.be.true;
      });

      it('response body should be an error message "Task already exists"', async () => {
        const { message } = ERROR_RESPONSE;
        await uniqueTaskController.handle(request, response, next);

        expect(spiedJson.calledWith({ message })).to.be.true;
      });
    });
  });
});
