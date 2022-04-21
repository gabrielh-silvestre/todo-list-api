import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { UpdateTaskUseCase } from '../../../../src/modules/tasks/useCases/updateTask/UpdateTaskUseCase';

import { newTask, tasks } from '../../../mocks/tasks';

const tasksRepository = new TasksRepository();
const updateTaskUseCase = new UpdateTaskUseCase(tasksRepository);

describe('Test UpdateTaskUseCase', () => {
  const { id, title, description, status, userId } = newTask;

  let findByIdStub: Sinon.SinonStub;
  let updateStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByIdStub = Sinon.stub(tasksRepository, 'findById').resolves(tasks[0]);
      updateStub = Sinon.stub(tasksRepository, 'update').resolves(newTask);
    });

    after(() => {
      findByIdStub.restore();
      updateStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "UPDATED"', async () => {
        const response = await updateTaskUseCase.execute(userId, id, {
          title,
          description,
          status,
        });

        expect(response.statusCode).to.be.equal('UPDATED');
      });

      it('data should be the updated Task', async () => {
        const response = await updateTaskUseCase.execute(userId, id, {
          title,
          description,
          status,
        });

        expect(response.data).to.be.deep.equal(newTask);
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
            await updateTaskUseCase.execute(userId, id, {
              title,
              description,
              status,
            });
            expect.fail('Should throw a not found error');
          } catch (error) {
            expect(error.getBody().errorCode).to.be.equal(404);
          }
        });

        it('message should be "Task not found"', async () => {
          try {
            await updateTaskUseCase.execute(userId, id, {
              title,
              description,
              status,
            });
            expect.fail('Should throw a not found error');
          } catch (error) {
            expect(error.getBody().message).to.be.equal('Task not found');
          }
        });
      });
    });
  });
});
