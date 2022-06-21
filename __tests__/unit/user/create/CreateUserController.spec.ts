import { NextFunction, request, response } from 'express';

import { expect } from 'chai';
import Sinon from 'sinon';

import { SuccessCase } from '../../../../src/@types/types';
import { TokenReturn } from '../../../../src/@types/types';

import {
  createUserUseCase,
  createUserController,
} from '../../../../src/modules/users/useCases/createUser/';

import { newUser } from '../../../mocks/users';

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const SUCCESS_RESPONSE: SuccessCase<TokenReturn> = {
  statusCode: 201,
  data: { token: FAKE_TOKEN },
};

const ERROR_RESPONSE = new Error('User already exists');

describe('Test CreateUserController', () => {
  let useCaseStub: Sinon.SinonStub;
  let spiedResponse: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  let spiedNext: Sinon.SinonSpy;
  const next = {
    next: () => {},
  } as { next: NextFunction };

  before(() => {
    spiedResponse = Sinon.spy(response, 'status');
    spiedJson = Sinon.spy(response, 'json');
    spiedNext = Sinon.spy(next, 'next');
  });

  after(() => {
    spiedResponse.restore();
    spiedJson.restore();
    spiedNext.restore();
  });

  describe('Success case', () => {
    before(() => {
      useCaseStub = Sinon.stub(createUserUseCase, 'execute');
      useCaseStub.resolves(SUCCESS_RESPONSE);

      request.body = newUser;
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should return a response with status 201 and user token on body', async () => {
      await createUserController.handle(request, response, next.next);

      expect(spiedResponse.calledWith(201)).to.be.true;

      expect(spiedJson.args[0][0]).to.be.an('object');
      expect(spiedJson.args[0][0]).to.have.property('token');
      expect(spiedJson.args[0][0].token).to.be.an('string');
    });
  });

  describe('Error case', () => {
    before(() => {
      useCaseStub = Sinon.stub(createUserUseCase, 'execute');
      useCaseStub.rejects(ERROR_RESPONSE);

      request.body = newUser;
    });

    after(() => {
      useCaseStub.restore();
    });

    it('should call "next" error middleware', async () => {
      await createUserController.handle(request, response, next.next);

      expect(spiedNext.called).to.be.true;
    });
  });
});
