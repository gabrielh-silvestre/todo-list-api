import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ErrorStatusCode } from '../../../../@types/types';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { GetAllTasksUseCase } from '../../../../modules/tasks/useCases/getAllTasks/GetAllTasksUseCase';

import { BaseError } from '../../../../utils/Errors/BaseError';

const { INTERNAL_SERVER_ERROR } = ErrorStatusCode;
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

describe('Test GetAllTasksUseCase', () => {
  const [{ userId }] = MOCK_TASKS;
  let getAllStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      getAllStub = Sinon.stub(tasksRepository, 'findAll').resolves(MOCK_TASKS);
    });

    after(() => {
      getAllStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "OK"', async () => {
        const response = await getAllTasksUseCase.execute(userId);

        expect(response.statusCode).to.be.equal('OK');
      });

      it('data should be the finded Tasks', async () => {
        const response = await getAllTasksUseCase.execute(userId);

        expect(response.data).to.be.deep.equal(MOCK_TASKS);
      });
    });
  });
});
