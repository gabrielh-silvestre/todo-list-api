import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { InternalError } from 'restify-errors';

import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { CreateTaskUseCase } from '../../../../src/modules/tasks/useCases/createTask/CreateTaskUseCase';
import { CreateTaskController } from '../../../../src/modules/tasks/useCases/createTask/CreateTaskController';

import { newTask } from '../../../mocks/tasks';

const tasksRepository = new TasksRepository();
const createTaskUseCase = new CreateTaskUseCase(tasksRepository);
const createTaskController = new CreateTaskController(createTaskUseCase);

describe('Test CreateTaskController', () => {
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
    const { title, description, userId } = newTask;

    const SUCCES_RESPONSE: ISuccess<Task> = {
      statusCode: 'CREATED',
      data: newTask,
    };

    before(() => {
      useCaseStub = Sinon.stub(createTaskUseCase, 'execute').resolves(
        SUCCES_RESPONSE
      );

      request.body = {
        title,
        description,
        userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be 201', async () => {
        await createTaskController.handle(request, response, next.next);

        expect(spiedStatus.calledWith(201)).to.be.true;
      });

      it('data should be the created Task', async () => {
        await createTaskController.handle(request, response, next.next);

        expect(spiedJson.calledWith(newTask)).to.be.true;
      });
    });
  });

  describe('Error case', () => {
    const { title, description, userId } = newTask;
    const ERROR_RESPONSE = new InternalError(
      'Unexpected error while creating task',
      'test env'
    );

    before(() => {
      useCaseStub = Sinon.stub(createTaskUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

      request.body = {
        title,
        description,
        userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should call "next" error middleware', () => {
      it('"next" should be called with CustomError as args', async () => {
        await createTaskController.handle(request, response, next.next);

        expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
