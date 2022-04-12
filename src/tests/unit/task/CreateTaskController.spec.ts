import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../modules/tasks/repository/TasksRepository';
import { CreateTaskUseCase } from '../../../modules/tasks/useCases/createTask/CreateTaskUseCase';
import { CreateTaskController } from '../../../modules/tasks/useCases/createTask/CreateTaskController';
import { ISuccess } from '../../../@types/interfaces';

const NEW_TASK: Task = {
  id: '5',
  title: 'Task 5',
  description: 'Description 5',
  status: 'TODO',
  userId: '1',
  updatedAt: new Date(),
};

const tasksRepository = new TasksRepository();
const createTaskUseCase = new CreateTaskUseCase(tasksRepository);
const createTaskController = new CreateTaskController(createTaskUseCase);

describe('Test CreateTaskController', () => {
  let useCaseStub: Sinon.SinonStub;
  let spiedStatus: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  const next: NextFunction = () => {};

  before(() => {
    spiedStatus = Sinon.spy(response, 'status');
    spiedJson = Sinon.spy(response, 'json');
  });

  after(() => {
    spiedStatus.restore();
    spiedJson.restore();
  });

  describe('Success case', () => {
    const { title, description, userId } = NEW_TASK;

    const SUCCES_RESPONSE: ISuccess<Task> = {
      statusCode: 'CREATED',
      data: NEW_TASK,
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
        await createTaskController.handle(request, response, next);

        expect(spiedStatus.calledWith(201)).to.be.true;
      });

      it('data should be the created Task', async () => {
        await createTaskController.handle(request, response, next);

        expect(spiedJson.calledWith(NEW_TASK)).to.be.true;
      });
    });
  });
});
