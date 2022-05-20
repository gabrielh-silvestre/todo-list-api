import { HttpError } from 'restify-errors';

import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { CreateTaskUseCase } from '../../../../src/modules/tasks/useCases/createTask/CreateTaskUseCase';

import { newTask, tasks } from '../../../mocks/tasks';

const tasksRepository = new TasksRepository();
const createTaskUseCase = new CreateTaskUseCase(tasksRepository);

describe('Test CreateTaskUseCase', () => {
  const { title, description, userId } = newTask;

  let createStub: Sinon.SinonStub;
  let findByTitleStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByTitleStub = Sinon.stub(
        tasksRepository,
        'findByExactTitle'
      ).resolves([]);
      createStub = Sinon.stub(tasksRepository, 'create').resolves(newTask);
    });

    after(() => {
      findByTitleStub.restore();
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

          expect(response.data).to.be.deep.equal(newTask);
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

          expect(response.data).to.be.deep.equal(newTask);
        });
      });
    });
  });

  describe('Error case', () => {
    describe('Task with this title already exists', () => {
      before(() => {
        findByTitleStub = Sinon.stub(
          tasksRepository,
          'findByExactTitle'
        ).resolves(tasks);
      });

      after(() => {
        findByTitleStub.restore();
      });

      describe('Should throw a conflict error with status and message', () => {
        it('status should be 409', async () => {
          try {
            await createTaskUseCase.execute({
              title,
              description,
              userId,
            });
            expect.fail('Should throw a conflict error');
          } catch (error) {
            const tErr = error as HttpError;
            expect(tErr.statusCode).to.be.equal(409);
          }
        });

        it('message should be "Task with this title already exists"', async () => {
          try {
            await createTaskUseCase.execute({
              title,
              description,
              userId,
            });
            expect.fail('Should throw a conflict error');
          } catch (error) {
            const tErr = error as HttpError;
            expect(tErr.message).to.be.equal(
              'Task with this title already exists'
            );
          }
        });
      });
    });
  });
});
