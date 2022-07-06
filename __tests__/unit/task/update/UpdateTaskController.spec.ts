import { NextFunction, request, response } from 'express';

import { expect } from 'chai';
import Sinon from 'sinon';

import { SuccessCase } from '../../../../src/typings/types';
import { TaskReturn } from '../../../../src/typings/types';

import {
  updateTaskUseCase,
  updateTaskController,
} from '../../../../src/modules/tasks/useCases/updateTask';

import { newTask } from '../../../mocks/tasks';

const { id, title, description, status, updatedAt } = newTask;

const SUCCESS_RESPONSE: SuccessCase<TaskReturn> = {
  statusCode: 200,
  data: {
    id,
    title,
    description,
    status,
    updatedAt,
  },
};

const ERROR_RESPONSE = new Error('Test error');

describe('Test UpdateTaskController', () => {
  let useCaseStub: Sinon.SinonStub;
  let spiedStatus: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  let spiedNext: Sinon.SinonSpy;
  const next = {
    next: () => {},
  } as { next: NextFunction };

  before(() => {
    spiedStatus = Sinon.spy(response, 'status');
    spiedJson = Sinon.spy(response, 'json');
    spiedNext = Sinon.spy(next, 'next');
  });

  after(() => {
    spiedStatus.restore();
    spiedJson.restore();
    spiedNext.restore();
  });

  describe('Success case', () => {
    before(() => {
      useCaseStub = Sinon.stub(updateTaskUseCase, 'execute');
      useCaseStub.resolves(SUCCESS_RESPONSE);

      request.params = { id };
      request.body = { newTask };
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should return an response with status code and the updated task on body', async () => {
      await updateTaskController.handle(request, response, next.next);

      expect(spiedStatus.calledWith(200)).to.be.true;

      expect(spiedJson.args[0][0]).to.be.an('object');
      expect(spiedJson.args[0][0]).to.have.property('id');
      expect(spiedJson.args[0][0]).to.have.property('title');
      expect(spiedJson.args[0][0]).to.have.property('description');
      expect(spiedJson.args[0][0]).to.have.property('status');
      expect(spiedJson.args[0][0]).to.have.property('updatedAt');
    });
  });

  describe('Error case', () => {
    before(() => {
      useCaseStub = Sinon.stub(updateTaskUseCase, 'execute');
      useCaseStub.rejects(ERROR_RESPONSE);

      request.params = { id };
      request.body = { newTask };
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should call "next" error middleware', async () => {
      await updateTaskController.handle(request, response, next.next);

      expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
    });
  });
});
