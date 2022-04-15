import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { UpdateTaskUseCase } from '../../../../modules/tasks/useCases/updateTask/UpdateTaskUseCase';
import { UpdateTaskController } from '../../../../modules/tasks/useCases/updateTask/UpdateTaskController';

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
const updateTaskUseCase = new UpdateTaskUseCase(tasksRepository);
const updateTaskController = new UpdateTaskController(updateTaskUseCase);

describe('Test UpdateTaskController', () => {
  const { id, title, description, status, userId, updatedAt } = MOCK_TASK;

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
    const SUCCES_RESPONSE: ISuccess<TaskReturn> = {
      statusCode: 'UPDATED',
      data: {
        id,
        title,
        description,
        status,
        updatedAt,
      },
    };

    before(() => {
      useCaseStub = Sinon.stub(updateTaskUseCase, 'execute').resolves(
        SUCCES_RESPONSE
      );

      request.body = {
        id,
        title,
        description,
        status,
        userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should return a response with success status and data', () => {
      it('Should call response.status with 200', async () => {
        await updateTaskController.handle(request, response, next.next);

        expect(spiedStatus.calledWith(200)).to.be.true;
      });

      it('Should call response.json with SUCCES_RESPONSE', async () => {
        await updateTaskController.handle(request, response, next.next);

        expect(spiedJson.calledWith(SUCCES_RESPONSE.data)).to.be.true;
      });
    });
  });

  describe('Error case', () => {
    const ERROR_RESPONSE = new CustomError(
      'INTERNAL_SERVER_ERROR',
      'Unexpected error while updating task'
    );

    before(() => {
      useCaseStub = Sinon.stub(updateTaskUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

      request.body = {
        id,
        title,
        description,
        status,
        userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should call "next" error middleware', () => {
      it('Should call next with CustomError', async () => {
        await updateTaskController.handle(request, response, next.next);

        expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
