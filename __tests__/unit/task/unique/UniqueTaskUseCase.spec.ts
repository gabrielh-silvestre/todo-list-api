import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';
import { ErrorStatusCode } from '../../../../src/@types/types';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { UniqueTaskUseCase } from '../../../../src/modules/tasks/useCases/uniqueTask/UniqueTaskUseCase';

import { BaseError } from '../../../../src/utils/Errors/BaseError';

const { CONFLICT } = ErrorStatusCode;
const MOCK_TASK: Task = {
  id: '5',
  title: 'Task 5',
  description: 'Description 5',
  status: 'TODO',
  userId: '1',
  updatedAt: new Date(),
};

const tasksRepository = new TasksRepository();
const uniqueTaskUseCase = new UniqueTaskUseCase(tasksRepository);

describe('Test UniqueTaskUseCase', () => {
  let findByTitleStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByTitleStub = Sinon.stub(
        tasksRepository,
        'findByExactTitle'
      ).resolves([]);
    });

    after(() => {
      findByTitleStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      const { userId, title } = MOCK_TASK;

      it('success status should be "OK"', async () => {
        const response = (await uniqueTaskUseCase.execute(
          MOCK_TASK.userId,
          MOCK_TASK.title
        )) as ISuccess<null>;

        expect(response.statusCode).to.be.equal('OK');
      });

      it('data should be null', async () => {
        const response = (await uniqueTaskUseCase.execute(
          userId,
          title
        )) as ISuccess<null>;

        expect(response.data).to.be.null;
      });
    });
  });

  describe('Error case', () => {
    before(() => {
      findByTitleStub = Sinon.stub(
        tasksRepository,
        'findByExactTitle'
      ).resolves([MOCK_TASK]);
    });

    after(() => {
      findByTitleStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      const { userId, title } = MOCK_TASK;

      it('status should be "CONFLICT"', async () => {
        try {
          await uniqueTaskUseCase.execute(userId, title);
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.getBody().errorCode).to.be.equal(CONFLICT);
        }
      });

      it('message should be "Task with this title already exists"', async () => {
        try {
          await uniqueTaskUseCase.execute(userId, title);
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.message).to.be.equal(
            'Task with this title already exists'
          );
        }
      });
    });
  });
});
