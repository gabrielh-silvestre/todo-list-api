import { NextFunction, request, response } from 'express';

import { expect } from 'chai';
import Sinon from 'sinon';

import { SuccessCase } from '../../../../src/typings/types';
import { TokenReturn } from '../../../../src/typings/types';

import {
  loginUserUseCase,
  loginUserController,
} from '../../../../src/modules/users/useCases/loginUser';

import { newUser } from '../../../mocks/users';

const FAKE_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

const SUCCESS_RESPONSE: SuccessCase<TokenReturn> = {
  statusCode: 200,
  data: { token: FAKE_TOKEN },
};

const ERROR_RESPONSE = new Error('Invalid email or password');

describe('Test LoginUserController', () => {
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
      useCaseStub = Sinon.stub(loginUserUseCase, 'execute');
      useCaseStub.resolves(SUCCESS_RESPONSE);

      request.body = newUser;
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should return a response with status 200 and user token on body', async () => {
      await loginUserController.handle(request, response, next.next);

      expect(spiedStatus.calledWith(200)).to.be.true;

      expect(spiedJson.args[0][0]).to.be.an('object');
      expect(spiedJson.args[0][0]).to.have.property('token');
      expect(spiedJson.args[0][0].token).to.be.an('string');
    });
  });

  describe('Error case', () => {
    before(() => {
      useCaseStub = Sinon.stub(loginUserUseCase, 'execute');
      useCaseStub.rejects(ERROR_RESPONSE);

      request.body = newUser;
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should call "next" error middleware', async () => {
      await loginUserController.handle(request, response, next.next);

      expect(spiedNext.called).to.be.true;
    });
  });
});
