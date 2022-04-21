import { NextFunction, request, response } from 'express';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';
import { TaskReturn } from '../../../../src/@types/types';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { UpdateTaskUseCase } from '../../../../src/modules/tasks/useCases/updateTask/UpdateTaskUseCase';
import { UpdateTaskController } from '../../../../src/modules/tasks/useCases/updateTask/UpdateTaskController';

import { InternalError } from '../../../../src/utils/Errors';
import { newTask } from '../../../mocks/tasks';

const tasksRepository = new TasksRepository();
const updateTaskUseCase = new UpdateTaskUseCase(tasksRepository);
const updateTaskController = new UpdateTaskController(updateTaskUseCase);

describe('Test UpdateTaskController', () => {
  const { id, title, description, status, userId, updatedAt } = newTask;

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

      request.params = { id };
      request.body = {
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
    const ERROR_RESPONSE = new InternalError(
      'Unexpected error while updating task',
      'test env'
    );

    before(() => {
      useCaseStub = Sinon.stub(updateTaskUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

      request.params = { id };
      request.body = {
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
