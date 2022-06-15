import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { getAllTasksUseCase } from '../../../../src/modules/tasks/useCases/getAllTasks';

import { tasks } from '../../../mocks/tasks';

const [{ userId }] = tasks;

describe('Test GetAllTasksUseCase', () => {
  let getAllStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      getAllStub = Sinon.stub(TasksRepository.prototype, 'findAll');
      getAllStub.resolves(tasks);
    });

    after(() => {
      getAllStub.restore();
    });

    it('should return a object with an status code and data', async () => {
      const response = await getAllTasksUseCase.execute({ userId });

      expect(response).to.be.an('object');
      expect(response).to.have.property('statusCode');
      expect(response).to.have.property('data');

      expect(response.statusCode).to.be.equal(200);
      expect(response.data).to.be.an('array');

      expect(response.data[0]).to.be.an('object');
      expect(response.data[0]).to.have.property('id');
      expect(response.data[0]).to.have.property('title');
      expect(response.data[0]).to.have.property('description');
      expect(response.data[0]).to.have.property('status');
      expect(response.data[0]).to.have.property('updatedAt');
    });
  });
});
