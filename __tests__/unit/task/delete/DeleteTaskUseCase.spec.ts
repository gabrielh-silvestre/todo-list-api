import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { DeleteTaskUseCase } from '../../../../src/modules/tasks/useCases/deleteTask/DeleteTaskUseCase';

import { newTask, tasks } from '../../../mocks/tasks';

const tasksRepository = new TasksRepository();
const deleteTaskUseCase = new DeleteTaskUseCase(tasksRepository);

describe('Test DeleteTaskUseCase', () => {
  const { id, userId } = newTask;

  let findByIdStub: Sinon.SinonStub;
  let deleteStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByIdStub = Sinon.stub(tasksRepository, 'findById').resolves(tasks[0]);
      deleteStub = Sinon.stub(tasksRepository, 'delete').resolves();
    });

    after(() => {
      findByIdStub.restore();
      deleteStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "DELETED"', async () => {
        const response = await deleteTaskUseCase.execute(userId, id);

        expect(response.statusCode).to.be.equal('DELETED');
      });

      it('data should be null', async () => {
        const response = await deleteTaskUseCase.execute(userId, id);

        expect(response.data).to.be.deep.equal(null);
      });
    });
  });

  describe('Error case', () => {
    describe('Task does not exist', () => {
      before(() => {
        findByIdStub = Sinon.stub(tasksRepository, 'findById').resolves(null);
      });

      after(() => {
        findByIdStub.restore();
      });

      describe('Should throw a not found error with status and message', () => {
        it('status should be 404', async () => {
          try {
            await deleteTaskUseCase.execute(userId, id);
            expect.fail('Should throw a not found error');
          } catch (error) {
            expect(error.getBody().errorCode).to.be.equal(404);
          }
        });

        it('message should be "Task not found"', async () => {
          try {
            await deleteTaskUseCase.execute(userId, id);
            expect.fail('Should throw a not found error');
          } catch (error) {
            expect(error.getBody().message).to.be.equal('Task not found');
          }
        });
      });
    });
  });
});
