import { NextFunction, request, response } from 'express';
import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';

import { EncriptService } from '../../../../services/Encript';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { CreateUserUseCase } from '../../../../modules/users/useCases/createUser/CreateUserUseCase';
import { CreateUserController } from '../../../../modules/users/useCases/createUser/CreateUserController';
import { AuthService } from '../../../../services/Auth';

const MOCK_USER: User = {
  id: '5',
  email: 'person5@email.com',
  username: 'person5',
  password: '123456',
};

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const authService = new AuthService();
const encriptService = new EncriptService();
const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(
  userRepository,
  authService,
  encriptService
);
const createUserController = new CreateUserController(createUserUseCase);

describe('Test CreateUserController', () => {
  let spiedResponse: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  let useCaseStub: Sinon.SinonStub;
  const next: NextFunction = () => {};

  before(() => {
    spiedResponse = Sinon.spy(response, 'status');
    spiedJson = Sinon.spy(response, 'json');
  });

  after(() => {
    spiedResponse.restore();
    spiedJson.restore();
  });

  describe('Success case', () => {
    const { email, username, password } = MOCK_USER;
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
    });

    it('should return a response with status 201', async () => {
      await createUserController.handle(request, response, next);

      expect(spiedResponse.calledWith(201)).to.be.true;
    });

    it('should return a response with the user created', async () => {
      const { data } = SUCCES_RESPONSE;
      await createUserController.handle(request, response, next);

      expect(spiedJson.calledWith({ token: data })).to.be.true;
    });
  });
});
