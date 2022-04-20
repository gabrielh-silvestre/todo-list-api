import { NextFunction, request, response } from 'express';
import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode } from '../../../../@types/types';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { UniqueUserUseCase } from '../../../../modules/users/useCases/uniqueUser/UniqueUserUseCase';
import { UniqueUserController } from '../../../../modules/users/useCases/uniqueUser/UniqueUserController';

import { ConflictError } from '../../../../utils/Errors';

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
        await uniqueUserController.handle(request, response, next.next);
        const [args] = spiedNext.args;

        expect(args).to.be.empty;
      });
    });
  });

  describe('Error case', () => {
    const ERROR_RESPONSE = new ConflictError('User already exists');

    before(() => {
      useCaseStub = Sinon.stub(uniqueUserUseCase, 'execute').rejects(
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

    describe('Should call "next" error middleware', () => {
      it('"next" error middleware should be called with CustomError as args', async () => {
        await uniqueUserController.handle(request, response, next.next);

        expect(spiedNext.calledWith(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
