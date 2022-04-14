import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { DeleteTaskUseCase } from '../../../../modules/tasks/useCases/deleteTask/DeleteTaskUseCase';
import { DeleteTaskController } from '../../../../modules/tasks/useCases/deleteTask/DeleteTaskController';

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
  let useCaseStub: Sinon.SinonStub;
  let spiedStatus: Sinon.SinonSpy;
  let spiedEnd: Sinon.SinonSpy;
  const next: NextFunction = () => {};

  before(() => {
    spiedStatus = Sinon.spy(response, 'status');
    spiedEnd = Sinon.spy(response, 'end');
  });

  after(() => {
    spiedStatus.restore();
    spiedEnd.restore();
  });

  describe('Success case', () => {
    const { id } = MOCK_TASK;

    before(() => {
      useCaseStub = Sinon.stub(deleteTaskUseCase, 'execute').resolves({
        statusCode: 'DELETED',
        data: null,
      });

      request.params = {
        id,
      };

      request.body = {
        userId: '1',
      };
    });

    after(() => {
      useCaseStub.restore();
      request.params = {};
      request.body = {};
    });

    describe('Should return a response with an success status', () => {
      it('success status should be 204', async () => {
        await deleteTaskController.handle(request, response, next);

        expect(spiedStatus.calledWith(204)).to.be.true;
      });

      it('response should end', async () => {
        await deleteTaskController.handle(request, response, next);

        expect(spiedEnd.calledWith()).to.be.true;
      });
    });
  });
});
