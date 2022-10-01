import { expect } from 'chai';

import { TasksRepositoryInMemory } from '../../../../src/infra/task/repository/memory/Task.repository';
import { DeleteTaskUseCase } from '../../../../src/modules/tasks/useCases/deleteTask/DeleteTaskUseCase';

import { newTask } from '../../../mocks/tasks';

const { id, userId } = newTask;

const taskRepositoryInMemory = new TasksRepositoryInMemory();
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepositoryInMemory);

describe('Test DeleteTaskUseCase', () => {
  before(() => {
    taskRepositoryInMemory.create(newTask);
  });

  describe('Success case', () => {
    it('should return a object with an status code and data', async () => {
      const response = await deleteTaskUseCase.execute({ userId, id });

      expect(response).to.be.an('object');
      expect(response).to.have.property('statusCode');
      expect(response).to.have.property('data');

      expect(response.statusCode).to.be.equal(204);
      expect(response.data).to.be.null;
    });
  });

  describe('Error case', () => {
    describe('Invalid "task id" case', () => {
      it('should throw an error with status code and message', async () => {
        try {
          await deleteTaskUseCase.execute({ userId, id });
          expect.fail('Should throw a not found error');
        } catch (error) {
          expect(error).to.be.an('object');
          expect(error).to.have.property('statusCode');
          expect(error).to.have.property('message');

          expect(error.statusCode).to.be.equal(404);
          expect(error.message).to.be.equal('Task not found');
        }
      });
    });
  });
});
