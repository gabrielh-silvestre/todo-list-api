import { NextFunction, request, response } from 'express';

import { expect } from 'chai';
import Sinon from 'sinon';

import { SuccessCase } from '../../../../src/typings/types';

import {
  verifyUserUseCase,
  verifyUserController,
} from '../../../../src/modules/users/useCases/verifyUser';

import { users } from '../../../mocks/users';

const [{ id: userId }] = users;

const SUCCESS_RESPONSE: SuccessCase<null> = {
  statusCode: 200,
  data: null,
};

const ERROR_RESPONSE = new Error('User does not exist');

describe('Test VerifyUserController', () => {
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
      useCaseStub = Sinon.stub(verifyUserUseCase, 'execute');
      useCaseStub.resolves(SUCCESS_RESPONSE);

      request.body = { userId };
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should call "next" middleware', async () => {
      await verifyUserController.handle(request, response, next.next);

      expect(spiedNext.calledWithExactly()).to.be.true;
    });
  });

  describe('Error case', () => {
    before(() => {
      useCaseStub = Sinon.stub(verifyUserUseCase, 'execute');
      useCaseStub.rejects(ERROR_RESPONSE);

      request.body = { userId };
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should call "next" error middleware', async () => {
      await verifyUserController.handle(request, response, next.next);

      expect(spiedNext.calledWithExactly(ERROR_RESPONSE)).to.be.true;
    });
  });
});
