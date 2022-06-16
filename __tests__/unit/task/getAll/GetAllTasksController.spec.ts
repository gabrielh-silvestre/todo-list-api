import { NextFunction, request, response } from 'express';

import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';
import { TaskReturn } from '../../../../src/@types/types';

import {
  getAllTasksUseCase,
  getAllTasksController,
} from '../../../../src/modules/tasks/useCases/getAllTasks';

import { tasks } from '../../../mocks/tasks';

const [{ userId }] = tasks;

const SUCCESS_RESPONSE: ISuccess<TaskReturn[]> = {
  statusCode: 200,
  data: tasks,
};

const ERROR_RESPONSE = new Error('Test error');

describe('Test GetAllTasksController', () => {
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
      useCaseStub = Sinon.stub(getAllTasksUseCase, 'execute');
      useCaseStub.resolves(SUCCESS_RESPONSE);

      request.body = { userId };
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should return an response with status 200 and tasks on body', async () => {
      await getAllTasksController.handle(request, response, next.next);

      expect(spiedStatus.calledWith(200)).to.be.true;
      expect(spiedJson.args[0][0]).to.be.an('array');
      expect(spiedJson.args[0][0][0]).to.be.an('object');

      expect(spiedJson.args[0][0][0]).to.have.property('id');
      expect(spiedJson.args[0][0][0]).to.have.property('title');
      expect(spiedJson.args[0][0][0]).to.have.property('description');
      expect(spiedJson.args[0][0][0]).to.have.property('status');
      expect(spiedJson.args[0][0][0]).to.have.property('updatedAt');
    });
  });

  describe('Error case', () => {
    before(() => {
      useCaseStub = Sinon.stub(getAllTasksUseCase, 'execute');
      useCaseStub.rejects(ERROR_RESPONSE);

      request.body = { userId };
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should call "next" error middleware', async () => {
      await getAllTasksController.handle(request, response, next.next);

      expect(spiedNext.called).to.be.true;
    });
  });
});
