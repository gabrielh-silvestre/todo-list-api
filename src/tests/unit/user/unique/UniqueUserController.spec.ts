import { NextFunction, request, response } from 'express';
import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { IError, ISuccess } from '../../../../@types/interfaces';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { UniqueUserUseCase } from '../../../../modules/users/useCases/uniqueUser/UniqueUserUseCase';
import { UniqueUserController } from '../../../../modules/users/useCases/uniqueUser/UniqueUserController';

const NEW_USER: User = {
  id: '1',
  email: 'person1@email.com',
  username: 'person1',
  password: '123a456',
};

const userRepository = new UserRepository();
const uniqueUserUseCase = new UniqueUserUseCase(userRepository);
const uniqueUserController = new UniqueUserController(uniqueUserUseCase);

describe('Test UniqueUserController', () => {
  let spiedStatus: Sinon.SinonSpy;
  let spiedJson: Sinon.SinonSpy;
  let useCaseStub: Sinon.SinonStub;
  let spiedNext: Sinon.SinonSpy;
  const next: NextFunction = () => {};

  before(() => {
    spiedStatus = Sinon.spy(response, 'status');
    spiedJson = Sinon.spy(response, 'json');
    spiedNext = Sinon.spy(next);
  });

  after(() => {
    spiedStatus.restore();
    spiedJson.restore();
  });

  describe('Success case', () => {
    const SUCCES_RESPONSE: ISuccess<null> = {
      statusCode: 'OK',
      data: null,
    };

    before(() => {
      useCaseStub = Sinon.stub(uniqueUserUseCase, 'execute').resolves(
        SUCCES_RESPONSE
      );

      request.body = {
        email: NEW_USER.email,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should call "next" middleware', () => {
      it('should call "next" middleware without args', async () => {
        await uniqueUserController.handle(request, response, next);

        expect(spiedNext.args).to.be.empty;
      });
    });
  });

  describe('Error case', () => {
    const ERROR_RESPONSE: IError = {
      statusCode: 'CONFLICT',
      message: 'User already exists',
    };

    before(() => {
      useCaseStub = Sinon.stub(uniqueUserUseCase, 'execute').resolves(
        ERROR_RESPONSE
      );

      request.body = {
        email: NEW_USER.email,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should return a response with an error status and message', () => {
      it('response status should be 409', async () => {
        await uniqueUserController.handle(request, response, next);

        expect(spiedStatus.calledWith(409)).to.be.true;
      });

      it('response body should be an error message "User already exists"', async () => {
        const { message } = ERROR_RESPONSE;
        await uniqueUserController.handle(request, response, next);

        expect(spiedJson.calledWith({ message })).to.be.true;
      });
    });
  });
});
