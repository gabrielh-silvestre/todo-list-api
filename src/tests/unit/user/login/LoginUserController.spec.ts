import { NextFunction, request, response } from 'express';
import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { Auth } from '../../../../services/Auth';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../modules/users/useCases/loginUser/LoginUserUseCase';
import { LoginUserController } from '../../../../modules/users/useCases/loginUser/LoginUserController';

const USER: User = {
  id: '5',
  email: 'person5@email.com',
  username: 'person5',
  password: '123a456',
};

const FAKE_TOKEN = 'nASOmifoniv-auns09812jsnipoas-wpnioAa09sjvcawh012';

const userRepository = new UserRepository();
const authService = new Auth();
const loginUserUseCase = new LoginUserUseCase(userRepository, authService);
const loginUserController = new LoginUserController(loginUserUseCase);

describe('Test LoginUserController', () => {
  let spiedStatus: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  let useCaseStub: Sinon.SinonStub;
  const next: NextFunction = () => {};

  before(() => {
    spiedStatus = Sinon.spy(response, 'status');
    spiedJson = Sinon.spy(response, 'json');
  });

  after(() => {
    spiedStatus.restore();
    spiedJson.restore();
  });

  describe('Success case', () => {
    const { email, password } = USER;

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
        await loginUserController.handle(request, response, next);

        expect(spiedStatus.calledWith(200)).to.be.true;
      });

      it('data should be a authorization token', async () => {
        await loginUserController.handle(request, response, next);

        expect(spiedJson.calledWith({ token: FAKE_TOKEN })).to.be.true;
      });
    });
  });

  describe('Failure cases', () => {
    const { email, password } = USER;

    before(() => {
      useCaseStub = Sinon.stub(loginUserUseCase, 'execute').resolves({
        statusCode: 'NOT_FOUND',
        message: 'Invalid email or password',
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

    describe('Should return a object with an error status and message', () => {
      it('status should be 404', async () => {
        await loginUserController.handle(request, response, next);

        expect(spiedStatus.calledWith(404)).to.be.true;
      });

      it('message should be "Invalid email or password"', async () => {
        await loginUserController.handle(request, response, next);

        expect(spiedJson.calledWith({ message: 'Invalid email or password' }))
          .to.be.true;
      });
    });
  });
});
