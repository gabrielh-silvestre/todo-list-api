import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { GetAllTasksUseCase } from '../../../../src/modules/tasks/useCases/getAllTasks/GetAllTasksUseCase';

import { tasks } from '../../../mocks/tasks';

const tasksRepository = new TasksRepository();
const getAllTasksUseCase = new GetAllTasksUseCase(tasksRepository);

describe('Test GetAllTasksUseCase', () => {
  const [{ userId }] = tasks;
  let getAllStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      getAllStub = Sinon.stub(tasksRepository, 'findAll').resolves(tasks);
    });

    after(() => {
      getAllStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "OK"', async () => {
        const response = await getAllTasksUseCase.execute(userId);

        expect(response.statusCode).to.be.equal('OK');
      });

      it('data should be the finded Tasks', async () => {
        const response = await getAllTasksUseCase.execute(userId);

        expect(response.data).to.be.deep.equal(tasks);
      });
    });
  });
});
