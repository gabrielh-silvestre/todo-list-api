import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode } from '../../../../@types/types';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { UniqueTaskUseCase } from '../../../../modules/tasks/useCases/uniqueTask/UniqueTaskUseCase';

import { CustomError } from '../../../../utils/CustomError';

const { CONFLICT, INTERNAL_SERVER_ERROR } = ErrorStatusCode;
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
          const tErr = err as CustomError;
          expect(tErr.statusCode).to.be.equal(CONFLICT);
        }
      });

      it('message should be "Task with this title already exists"', async () => {
        try {
          await uniqueTaskUseCase.execute(userId, title);
        } catch (err) {
          const tErr = err as CustomError;
          expect(tErr.message).to.be.equal(
            'Task with this title already exists'
          );
        }
      });
    });
  });

  describe('Database error case', () => {
    before(() => {
      findByTitleStub = Sinon.stub(
        tasksRepository,
        'findByExactTitle'
      ).rejects();
    });

    after(() => {
      findByTitleStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      const { userId, title } = MOCK_TASK;

      it('status should be "INTERNAL_SERVER_ERROR"', async () => {
        try {
          await uniqueTaskUseCase.execute(userId, title);
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as CustomError;
          expect(tErr.statusCode).to.be.equal(INTERNAL_SERVER_ERROR);
        }
      });

      it('message should be "Unexpected error while checking task uniqueness"', async () => {
        try {
          await uniqueTaskUseCase.execute(userId, title);
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as CustomError;
          expect(tErr.message).to.be.equal(
            'Unexpected error while checking task uniqueness'
          );
        }
      });
    });
  });
});
