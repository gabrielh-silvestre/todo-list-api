import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { updateTaskUseCase } from '../../../../src/modules/tasks/useCases/updateTask';

import { newTask, tasks } from '../../../mocks/tasks';

const [foundTask] = tasks;
const { id, title, description, status, userId } = newTask;

describe('Test UpdateTaskUseCase', () => {
  let findByIdStub: Sinon.SinonStub;
  let updateStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByIdStub = Sinon.stub(TasksRepository.prototype, 'findById');
      findByIdStub.resolves(foundTask);

      updateStub = Sinon.stub(TasksRepository.prototype, 'update');
      updateStub.resolves(newTask);
    });

    after(() => {
      findByIdStub.restore();
      updateStub.restore();
    });

    describe('should return a object with status code and data', async () => {
      const response = await updateTaskUseCase.execute({
        userId,
        id,
        title,
        description,
        status,
      });

      expect(response).to.be.an('object');
      expect(response).to.have.property('statusCode');
      expect(response).to.have.property('data');

      expect(response.statusCode).to.be.equal(200);
      expect(response.data).to.be.an('object');

      expect(response.data).to.have.property('id');
      expect(response.data).to.have.property('title');
      expect(response.data).to.have.property('description');
      expect(response.data).to.have.property('status');
      expect(response.data).to.have.property('updatedAt');
    });
  });

  describe('Error case', () => {
    describe('Invalid "task id" case', () => {
      before(() => {
        findByIdStub = Sinon.stub(TasksRepository.prototype, 'findById');
        findByIdStub.resolves(null);
      });

      after(() => {
        findByIdStub.restore();
      });

      it('should throw an error with status code and message', async () => {
        try {
          await updateTaskUseCase.execute({
            userId,
            id,
            title,
            description,
            status,
          });
          expect.fail('Should throw a error');
        } catch (error) {
          expect(error).to.have.property('statusCode');
          expect(error).to.have.property('message');

          expect(error.statusCode).to.be.equal(404);
          expect(error.message).to.be.equal('Task not found');
        }
      });
    });
  });
});
