import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';
import { IError, ISuccess } from '../../../../@types/interfaces';

import { TasksRepository } from '../../../../modules/tasks/repository/TasksRepository';
import { UniqueTaskUseCase } from '../../../../modules/tasks/useCases/uniqueTitle/UniqueTaskUseCase';

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
      findByTitleStub = Sinon.stub(tasksRepository, 'findByTitle').resolves([]);
    });

    after(() => {
      findByTitleStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "OK"', async () => {
        const response = await uniqueTaskUseCase.execute(
          MOCK_TASK.userId,
          MOCK_TASK.title
        );

        expect(response.statusCode).to.be.equal('OK');
      });

      it('data should be null', async () => {
        const response = (await uniqueTaskUseCase.execute(
          MOCK_TASK.userId,
          MOCK_TASK.title
        )) as ISuccess<null>;

        expect(response.data).to.be.null;
      });
    });
  });

  describe('Error case', () => {
    before(() => {
      findByTitleStub = Sinon.stub(tasksRepository, 'findByTitle').resolves([
        MOCK_TASK,
      ]);
    });

    after(() => {
      findByTitleStub.restore();
    });

    describe('Should return a object with an error status and data', () => {
      it('success status should be "CONFLICT"', async () => {
        const response = await uniqueTaskUseCase.execute(
          MOCK_TASK.userId,
          MOCK_TASK.title
        );

        expect(response.statusCode).to.be.equal('CONFLICT');
      });

      it('error message should be "Task already exists"', async () => {
        const response = (await uniqueTaskUseCase.execute(
          MOCK_TASK.userId,
          MOCK_TASK.title
        )) as IError;

        expect(response.message).to.be.equal('Task already exists');
      });
    });
  });
});
