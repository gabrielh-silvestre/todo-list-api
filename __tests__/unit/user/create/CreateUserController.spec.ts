import { NextFunction, request, response } from 'express';
import { ConflictError } from 'restify-errors';

import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';

import { EncryptService } from '../../../../src/services/Encrypt';
import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { CreateUserUseCase } from '../../../../src/modules/users/useCases/createUser/CreateUserUseCase';
import { CreateUserController } from '../../../../src/modules/users/useCases/createUser/CreateUserController';
import { AuthService } from '../../../../src/services/Auth';

import { newUser } from '../../../mocks/users';

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const authService = new AuthService();
const encryptService = new EncryptService();
const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(
  userRepository,
  authService,
  encryptService
);
const createUserController = new CreateUserController(createUserUseCase);

describe('Test CreateUserController', () => {
  const { email, username, password } = newUser;

  let useCaseStub: Sinon.SinonStub;
  let spiedResponse: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  let spiedNext: Sinon.SinonSpy;
  const next = {
    next: (args) => {},
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
    const SUCCES_RESPONSE: ISuccess<string> = {
      statusCode: 'CREATED',
      data: FAKE_TOKEN,
    };

    before(() => {
      useCaseStub = Sinon.stub(createUserUseCase, 'execute').resolves(
        SUCCES_RESPONSE
      );

      request.body = {
        email,
        username,
        password,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    it('should return a response with status 201', async () => {
      await createUserController.handle(request, response, next.next);

      expect(spiedResponse.calledWith(201)).to.be.true;
    });

    it('should return a response with the user created', async () => {
      const { data } = SUCCES_RESPONSE;
      await createUserController.handle(request, response, next.next);

      expect(spiedJson.calledWith({ token: data })).to.be.true;
    });
  });

  describe('Error case', () => {
    const ERROR_RESPONSE = new ConflictError('User already exists');

    before(() => {
      useCaseStub = Sinon.stub(createUserUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

      request.body = {
        email,
        username,
        password,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should call "next" error middleware', () => {
      it('"next" error middleware should be called with CustomError as args', async () => {
        await createUserController.handle(request, response, next.next);

        expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
