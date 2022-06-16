import { NextFunction, request, response } from 'express';
import { Task } from '@prisma/client';

import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';

import {
  createTaskUseCase,
  createTaskController,
} from '../../../../src/modules/tasks/useCases/createTask';

import { newTask } from '../../../mocks/tasks';

const { title, description, userId } = newTask;

const SUCCESS_RESPONSE: ISuccess<Task> = {
  statusCode: 201,
  data: newTask,
};

const ERROR_RESPONSE = new Error('Test error');

describe('Test CreateTaskController', () => {
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
      useCaseStub = Sinon.stub(createTaskUseCase, 'execute');
      useCaseStub.resolves(SUCCESS_RESPONSE);

      request.body = { title, description, userId };
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should return an response with status 201 and new task on body', async () => {
      await createTaskController.handle(request, response, next.next);

      expect(spiedStatus.calledWith(201)).to.be.true;

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
      useCaseStub = Sinon.stub(createTaskUseCase, 'execute');
      useCaseStub.rejects(ERROR_RESPONSE);

      request.body = { title, description, userId };
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should call "next" error middleware', async () => {
      await createTaskController.handle(request, response, next.next);

      expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
    });
  });
});
