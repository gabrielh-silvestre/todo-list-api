import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';
import { IError, ISuccess } from '../../../../@types/interfaces';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { VerifyTaskUseCase } from '../../../../modules/tasks/useCases/verifyTask/VerifyTaskUseCase';

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
      const { userId, id } = MOCK_TASK;

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

    describe('Should return a object with an error status and message', () => {
      const { userId, id } = MOCK_TASK;

      it('error status should be "NOT_FOUND"', async () => {
        const response = await verifyTaskUseCase.execute(userId, id);

        expect(response.statusCode).to.be.equal('NOT_FOUND');
      });

      it('message should be "Task not found"', async () => {
        const response = (await verifyTaskUseCase.execute(
          userId,
          id
        )) as IError;

        expect(response.message).to.be.equal('Task not found');
      });
    });
  });
});
