import { NextFunction, request, response } from 'express';
import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../helpers/interfaces';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { CreateUserUseCase } from '../../../../modules/users/useCases/createUser/CreateUserUseCase';
import { CreateUserController } from '../../../../modules/users/useCases/createUser/CreateUserController';

const NEW_USER: User = {
  id: '5',
  email: 'person5@email.com',
  username: 'person5',
  password: '123456',
};

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
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
    const SUCCES_RESPONSE: ISuccess<User> = {
      statusCode: 'CREATED',
      data: NEW_USER,
    };

    before(() => {
      useCaseStub = Sinon.stub(createUserUseCase, 'execute').resolves(
        SUCCES_RESPONSE
      );

      request.body = {
        email: NEW_USER.email,
        username: NEW_USER.username,
        password: NEW_USER.password,
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
      await createUserController.handle(request, response, next);

      expect(spiedJson.calledWith(SUCCES_RESPONSE.data)).to.be.true;
    });
  });
});
