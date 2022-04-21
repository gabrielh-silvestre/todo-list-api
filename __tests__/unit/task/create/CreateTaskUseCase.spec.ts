import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { CreateTaskUseCase } from '../../../../src/modules/tasks/useCases/createTask/CreateTaskUseCase';

const MOCK_TASK: Task = {
  id: '5',
  title: 'Task 5',
  description: 'Description 5',
  status: 'TODO',
  userId: '1',
  updatedAt: new Date(),
};

const tasksRepository = new TasksRepository();
const createTaskUseCase = new CreateTaskUseCase(tasksRepository);

describe('Test CreateTaskUseCase', () => {
  const { title, description, userId } = MOCK_TASK;
  let createStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      createStub = Sinon.stub(tasksRepository, 'create').resolves(MOCK_TASK);
    });

    after(() => {
      createStub.restore();
    });

    describe('Create test with description', () => {
      describe('Should return a object with an success status and data', () => {
        it('success status should be "CREATED"', async () => {
          const response = await createTaskUseCase.execute({
            title,
            description,
            userId,
          });

          expect(response.statusCode).to.be.equal('CREATED');
        });

        it('data should be the created Task', async () => {
          const response = await createTaskUseCase.execute({
            title,
            description,
            userId,
          });

          expect(response.data).to.be.deep.equal(MOCK_TASK);
        });
      });
    });

    describe('Create test without description', () => {
      describe('Should return a object with an success status and data', () => {
        it('success status should be "CREATED"', async () => {
          const response = await createTaskUseCase.execute({
            title,
            description: null,
            userId,
          });

          expect(response.statusCode).to.be.equal('CREATED');
        });

        it('data should be the created Task', async () => {
          const response = await createTaskUseCase.execute({
            title,
            description: null,
            userId,
          });

          expect(response.data).to.be.deep.equal(MOCK_TASK);
        });
      });
    });
  });
});
