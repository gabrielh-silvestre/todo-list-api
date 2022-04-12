import { Task } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../modules/tasks/repository/TasksRepository';
import { CreateTaskUseCase } from '../../../modules/tasks/useCases/createTask/CreateTaskUseCase';

const NEW_TASK: Task = {
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
  let createStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      createStub = Sinon.stub(tasksRepository, 'create').resolves(NEW_TASK);
    });

    after(() => {
      createStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      const { title, description, userId } = NEW_TASK;

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

        expect(response.data).to.be.deep.equal(NEW_TASK);
      });
    });
  });
});
