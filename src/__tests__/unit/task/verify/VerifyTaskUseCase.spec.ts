import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode } from '../../../../@types/types';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { VerifyTaskUseCase } from '../../../../modules/tasks/useCases/verifyTask/VerifyTaskUseCase';

import { BaseError } from '../../../../utils/Errors/BaseError';

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = ErrorStatusCode;
const MOCK_TASK: Task = {
  id: '5',
  title: 'Task 5',
  description: 'Description 5',
  status: 'TODO',
  userId: '1',
  updatedAt: new Date(),
};

const tasksRepository = new TasksRepository();
const verifyTaskUseCase = new VerifyTaskUseCase(tasksRepository);

describe('Test VerifyTaskUseCase', () => {
  const { userId, id } = MOCK_TASK;
  let findByIdStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByIdStub = Sinon.stub(tasksRepository, 'findById').resolves(
        MOCK_TASK
      );
    });

    after(() => {
      findByIdStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "OK"', async () => {
        const response = await verifyTaskUseCase.execute(userId, id);

        expect(response.statusCode).to.be.equal('OK');
      });

      it('data should be null', async () => {
        const response = (await verifyTaskUseCase.execute(
          userId,
          id
        )) as ISuccess<null>;

        expect(response.data).to.be.null;
      });
    });
  });

  describe('Error case', () => {
    before(() => {
      findByIdStub = Sinon.stub(tasksRepository, 'findById').resolves(null);
    });

    after(() => {
      findByIdStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      it('status should be "NOT_FOUND"', async () => {
        try {
          await verifyTaskUseCase.execute(userId, id);
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.getBody().errorCode).to.be.equal(NOT_FOUND);
        }
      });

      it('message should be "Task not found"', async () => {
        try {
          await verifyTaskUseCase.execute(userId, id);
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.message).to.be.equal('Task not found');
        }
      });
    });
  });

  describe('Database error case', () => {
    before(() => {
      findByIdStub = Sinon.stub(tasksRepository, 'findById').rejects();
    });

    after(() => {
      findByIdStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      it('status should be "INTERNAL_SERVER_ERROR"', async () => {
        try {
          await verifyTaskUseCase.execute(userId, id);
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.getBody().errorCode).to.be.equal(INTERNAL_SERVER_ERROR);
        }
      });

      it('message should be "Unexpected error while checking if task exist"', async () => {
        try {
          await verifyTaskUseCase.execute(userId, id);
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.message).to.be.equal(
            'Unexpected error while checking if task exist'
          );
        }
      });
    });
  });
});
