import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { deleteTaskUseCase } from '../../../../src/modules/tasks/useCases/deleteTask';

import { newTask, tasks } from '../../../mocks/tasks';

const [foundTask] = tasks;
const { id, userId } = newTask;

describe('Test DeleteTaskUseCase', () => {
  let findByIdStub: Sinon.SinonStub;
  let deleteStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByIdStub = Sinon.stub(TasksRepository.prototype, 'findById');
      findByIdStub.resolves(foundTask);

      deleteStub = Sinon.stub(TasksRepository.prototype, 'delete');
      deleteStub.resolves();
    });

    after(() => {
      findByIdStub.restore();
      deleteStub.restore();
    });

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
      before(() => {
        findByIdStub = Sinon.stub(TasksRepository.prototype, 'findById');
        findByIdStub.resolves(null);
      });

      after(() => {
        findByIdStub.restore();
      });

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
