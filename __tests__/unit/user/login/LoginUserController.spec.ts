import { NextFunction, request, response } from 'express';
import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { EncriptService } from '../../../../src/services/Encript';
import { AuthService } from '../../../../src/services/Auth';

import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../src/modules/users/useCases/loginUser/LoginUserUseCase';
import { LoginUserController } from '../../../../src/modules/users/useCases/loginUser/LoginUserController';

import { NotFoundError } from '../../../../src/utils/Errors';

const MOCK_USER: User = {
  id: '5',
  email: 'person5@email.com',
  username: 'person5',
  password: '123a456',
};

const FAKE_TOKEN = 'nASOmifoniv-auns09812jsnipoas-wpnioAa09sjvcawh012';

const encriptService = new EncriptService();
const authService = new AuthService();
const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  authService,
  encriptService
);
const loginUserController = new LoginUserController(loginUserUseCase);

describe('Test LoginUserController', () => {
  let useCaseStub: Sinon.SinonStub;
  let spiedStatus: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  let spiedNext: Sinon.SinonSpy;
  const next = {
    next: (args) => {},
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
    const { email, password } = MOCK_USER;

    before(() => {
      useCaseStub = Sinon.stub(loginUserUseCase, 'execute').resolves({
        statusCode: 'OK',
        data: FAKE_TOKEN,
      });

      request.body = {
        email,
        password,
      };
    });

    after(() => {
      useCaseStub.restore();

      request.body = {};
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be 200', async () => {
        await loginUserController.handle(request, response, next.next);

        expect(spiedStatus.calledWith(200)).to.be.true;
      });

      it('data should be a authorization token', async () => {
        await loginUserController.handle(request, response, next.next);

        expect(spiedJson.calledWith({ token: FAKE_TOKEN })).to.be.true;
      });
    });
  });

  describe('Error case', () => {
    const { email, password } = MOCK_USER;
    const ERROR_RESPONSE = new NotFoundError('Invalid email or password');

    before(() => {
      useCaseStub = Sinon.stub(loginUserUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

      request.body = {
        email,
        password,
      };
    });

    after(() => {
      useCaseStub.restore();

      request.body = {};
    });

    describe('Should call "next" error middleware', () => {
      it('"next" error middleware should be called with CustomError as args', async () => {
        await loginUserController.handle(request, response, next.next);

        expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
