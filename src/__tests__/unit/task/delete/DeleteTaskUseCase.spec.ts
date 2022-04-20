import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ErrorStatusCode } from '../../../../@types/types';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { DeleteTaskUseCase } from '../../../../modules/tasks/useCases/deleteTask/DeleteTaskUseCase';

import { CustomError } from '../../../../utils/CustomError';

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
const deleteTaskUseCase = new DeleteTaskUseCase(tasksRepository);

describe('Test DeleteTaskUseCase', () => {
  const { id, userId } = MOCK_TASK;
  let deleteStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      deleteStub = Sinon.stub(tasksRepository, 'delete').resolves();
    });

    after(() => {
      deleteStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "DELETED"', async () => {
        const response = await deleteTaskUseCase.execute(userId, id);

        expect(response.statusCode).to.be.equal('DELETED');
      });

      it('data should be null', async () => {
        const response = await deleteTaskUseCase.execute(userId, id);

        expect(response.data).to.be.deep.equal(null);
      });
    });
  });

  describe('Database error case', () => {
    before(() => {
      deleteStub = Sinon.stub(tasksRepository, 'delete').rejects();
    });

    after(() => {
      deleteStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      it('status should be "INTERNAL_SERVER_ERROR"', async () => {
        try {
          await deleteTaskUseCase.execute(userId, id);
        } catch (err) {
          const tErr = err as CustomError;
          expect(tErr.statusCode).to.be.equal(INTERNAL_SERVER_ERROR);
        }
      });

      it('message should be "Unexpected error while deleting task"', async () => {
        try {
          await deleteTaskUseCase.execute(userId, id);
        } catch (err) {
          const tErr = err as CustomError;
          expect(tErr.message).to.be.equal(
            'Unexpected error while deleting task'
          );
        }
      });
    });
  });
});
