import { expect } from 'chai';
import Sinon from 'sinon';

import { TasksRepository } from '../../../../src/modules/tasks/repository/TasksRepository';
import { createTaskUseCase } from '../../../../src/modules/tasks/useCases/createTask';

import { newTask, tasks } from '../../../mocks/tasks';

describe('Test CreateTaskUseCase', () => {
  let createStub: Sinon.SinonStub;
  let findByTitleStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByTitleStub = Sinon.stub(
        TasksRepository.prototype,
        'findByExactTitle'
      );
      findByTitleStub.resolves([]);

      createStub = Sinon.stub(TasksRepository.prototype, 'create');
      createStub.resolves(newTask);
    });

    after(() => {
      findByTitleStub.restore();
      createStub.restore();
    });

    describe('Create test with description', () => {
      it('should return a object with an status code and data', async () => {
        const response = await createTaskUseCase.execute(newTask);

        expect(response).to.be.an('object');
        expect(response).to.have.property('statusCode');
        expect(response).to.have.property('data');

        expect(response.statusCode).to.be.equal(201);
        expect(response.data).to.be.an('object');

        expect(response.data).to.have.property('id');
        expect(response.data).to.have.property('title');
        expect(response.data).to.have.property('description');
        expect(response.data).to.have.property('status');
        expect(response.data).to.have.property('updatedAt');
      });
    });

    describe('Create test without description', () => {
      it('should return a object with an status code and data', async () => {
        const response = await createTaskUseCase.execute(newTask);

        expect(response).to.be.an('object');
        expect(response).to.have.property('statusCode');
        expect(response).to.have.property('data');

        expect(response.statusCode).to.be.equal(201);
        expect(response.data).to.be.an('object');

        expect(response.data).to.have.property('id');
        expect(response.data).to.have.property('title');
        expect(response.data).to.have.property('description');
        expect(response.data).to.have.property('status');
        expect(response.data).to.have.property('updatedAt');
      });
    });
  });

  describe('Error case', () => {
    describe('Invalid "title" case', () => {
      before(() => {
        findByTitleStub = Sinon.stub(
          TasksRepository.prototype,
          'findByExactTitle'
        );
        findByTitleStub.resolves(tasks);
      });

      after(() => {
        findByTitleStub.restore();
      });

      it('should throw an error with status code and message', async () => {
        try {
          await createTaskUseCase.execute(newTask);
          expect.fail('Should throw a conflict error');
        } catch (error) {
          expect(error).to.have.property('statusCode');
          expect(error).to.have.property('message');

          expect(error.statusCode).to.be.equal(409);
          expect(error.message).to.be.equal(
            'Task with this title already exists'
          );
        }
      });
    });
  });
});
