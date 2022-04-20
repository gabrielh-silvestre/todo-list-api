import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ErrorStatusCode } from '../../../../@types/types';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { UpdateTaskUseCase } from '../../../../modules/tasks/useCases/updateTask/UpdateTaskUseCase';

import { BaseError } from '../../../../utils/Errors/BaseError';

const { INTERNAL_SERVER_ERROR } = ErrorStatusCode;
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

describe('Test UpdateTaskUseCase', () => {
  const { id, title, description, status, userId } = MOCK_TASK;
  let updateStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      before(() => {
        updateStub = Sinon.stub(tasksRepository, 'update').resolves(MOCK_TASK);
      });

      after(() => {
        updateStub.restore();
      });

      describe('Should return a object with an success status and data', () => {
        it('success status should be "UPDATED"', async () => {
          const response = await updateTaskUseCase.execute(userId, id, {
            title,
            description,
            status,
          });

          expect(response.statusCode).to.be.equal('UPDATED');
        });

        it('data should be the updated Task', async () => {
          const response = await updateTaskUseCase.execute(userId, id, {
            title,
            description,
            status,
          });

          expect(response.data).to.be.deep.equal(MOCK_TASK);
        });
      });
    });
  });
});
