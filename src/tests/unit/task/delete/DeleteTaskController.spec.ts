import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { DeleteTaskUseCase } from '../../../../modules/tasks/useCases/deleteTask/DeleteTaskUseCase';
import { DeleteTaskController } from '../../../../modules/tasks/useCases/deleteTask/DeleteTaskController';

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
const deleteTaskUseCase = new DeleteTaskUseCase(tasksRepository);
const deleteTaskController = new DeleteTaskController(deleteTaskUseCase);

describe('Test DeleteTaskController', () => {
  const { id, userId } = MOCK_TASK;

  let useCaseStub: Sinon.SinonStub;
  let spiedStatus: Sinon.SinonSpy;
  let spiedEnd: Sinon.SinonSpy;
  let spiedNext: Sinon.SinonSpy;
  const next = {
    next: (args) => {},
  } as { next: NextFunction };

  before(() => {
    spiedStatus = Sinon.spy(response, 'status');
    spiedEnd = Sinon.spy(response, 'end');
    spiedNext = Sinon.spy(next, 'next');
  });

  after(() => {
    spiedStatus.restore();
    spiedEnd.restore();
    spiedNext.restore();
  });

  describe('Success case', () => {
    before(() => {
      useCaseStub = Sinon.stub(deleteTaskUseCase, 'execute').resolves({
        statusCode: 'DELETED',
        data: null,
      });

      request.params = {
        id,
      };

      request.body = {
        userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.params = {};
      request.body = {};
    });

    describe('Should return a response with an success status', () => {
      it('success status should be 204', async () => {
        await deleteTaskController.handle(request, response, next.next);

        expect(spiedStatus.calledWith(204)).to.be.true;
      });

      it('response should end', async () => {
        await deleteTaskController.handle(request, response, next.next);

        expect(spiedEnd.calledWith()).to.be.true;
      });
    });
  });

  describe('Error case', () => {
    const ERROR_RESPONSE = new CustomError(
      'INTERNAL_SERVER_ERROR',
      'Unexpected error while deleting task'
    );

    before(() => {
      useCaseStub = Sinon.stub(deleteTaskUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

      request.params = {
        id,
      };

      request.body = {
        userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.params = {};
      request.body = {};
    });

    describe('Should call "next" error middleware', () => {
      it('"next" should be called with CustomError as args', async () => {
        await deleteTaskController.handle(request, response, next.next);

        expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
