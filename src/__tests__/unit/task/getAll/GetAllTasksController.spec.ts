import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode, TaskReturn } from '../../../../@types/types';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { GetAllTasksUseCase } from '../../../../modules/tasks/useCases/getAllTasks/GetAllTasksUseCase';
import { GetAllTasksController } from '../../../../modules/tasks/useCases/getAllTasks/GetAllTasksController';

import { CustomError } from '../../../../utils/CustomError';

const MOCK_TASKS: Task[] = [
  {
    id: '5',
    title: 'Task 5',
    description: 'Description 5',
    status: 'TODO',
    userId: '1',
    updatedAt: new Date(),
  },
  {
    id: '6',
    title: 'Task 6',
    description: 'Description 6',
    status: 'DONE',
    userId: '1',
    updatedAt: new Date(),
  },
];

const tasksRepository = new TasksRepository();
const getAllTasksUseCase = new GetAllTasksUseCase(tasksRepository);
const getAllTasksController = new GetAllTasksController(getAllTasksUseCase);

describe('Test GetAllTasksController', () => {
  const [{ userId }] = MOCK_TASKS;

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
    const SUCCES_RESPONSE: ISuccess<TaskReturn[]> = {
      statusCode: 'OK',
      data: MOCK_TASKS,
    };

    before(() => {
      useCaseStub = Sinon.stub(getAllTasksUseCase, 'execute').resolves(
        SUCCES_RESPONSE
      );

      request.body = {
        userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be 200', async () => {
        await getAllTasksController.handle(request, response, next.next);

        expect(spiedStatus.calledWith(200)).to.be.true;
      });

      it('data should be the finded tasks', async () => {
        await getAllTasksController.handle(request, response, next.next);

        expect(spiedJson.calledWith(SUCCES_RESPONSE.data)).to.be.true;
      });
    });
  });

  describe('Error case', () => {
    const ERROR_RESPONSE = new CustomError(
      ErrorStatusCode.INTERNAL_SERVER_ERROR,
      'Unexpected error while finding all tasks'
    );

    before(() => {
      useCaseStub = Sinon.stub(getAllTasksUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

      request.body = {
        userId,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should call "next" error middleware', () => {
      it('"next" should be called with CustomError', async () => {
        await getAllTasksController.handle(request, response, next.next);

        expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
