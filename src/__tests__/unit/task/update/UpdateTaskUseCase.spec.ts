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

  describe('Databse error case', () => {
    before(() => {
      updateStub = Sinon.stub(tasksRepository, 'update').rejects();
    });

    after(() => {
      updateStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      it('status should be "INTERNAL_SERVER_ERROR"', async () => {
        try {
          await updateTaskUseCase.execute(userId, id, {
            title,
            description,
            status,
          });
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.getBody().errorCode).to.be.equal(INTERNAL_SERVER_ERROR);
        }
      });

      it('message should be "Unexpected error while updating task"', async () => {
        try {
          await updateTaskUseCase.execute(userId, id, {
            title,
            description,
            status,
          });
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.message).to.be.equal(
            'Unexpected error while updating task'
          );
        }
      });
    });
  });
});
