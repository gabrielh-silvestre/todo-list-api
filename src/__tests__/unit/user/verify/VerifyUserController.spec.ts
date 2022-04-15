import { NextFunction, request, response } from 'express';
import { User } from '@prisma/client';
import { expect, should } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { VerifyUserUseCase } from '../../../../modules/users/useCases/verifyUser/VerifyUserUseUseCase';
import { VerifyUserController } from '../../../../modules/users/useCases/verifyUser/VerifyUserController';

import { CustomError } from '../../../../utils/CustomError';

const MOCK_USER: User = {
  id: '1',
  email: 'person1@email.com',
  username: 'person1',
  password: '123a456',
};

const userRepository = new UserRepository();
const verifyUserUseCase = new VerifyUserUseCase(userRepository);
const verifyUserController = new VerifyUserController(verifyUserUseCase);

describe('Test VerifyUserController', () => {
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
    const SUCCESS_RESPONSE: ISuccess<null> = {
      statusCode: 'OK',
      data: null,
    };

    before(() => {
      useCaseStub = Sinon.stub(verifyUserUseCase, 'execute').resolves(
        SUCCESS_RESPONSE
      );

      request.body = {
        userId: MOCK_USER.id,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should call "next" middleware', () => {
      it('should call "next" without args', async () => {
        await verifyUserController.handle(request, response, next.next);

        expect(spiedNext.calledWithExactly()).to.be.true;
      });
    });
  });

  describe('Error case', () => {
    const ERROR_RESPONSE = new CustomError('NOT_FOUND', 'User does not exist');

    before(() => {
      useCaseStub = Sinon.stub(verifyUserUseCase, 'execute').rejects(
        ERROR_RESPONSE
      );

      request.body = {
        userId: MOCK_USER.id,
      };
    });

    after(() => {
      useCaseStub.restore();
      request.body = {};
    });

    describe('Should call "next" error middleware', () => {
      it('should call "next" with error', async () => {
        await verifyUserController.handle(request, response, next.next);

        expect(spiedNext.calledWithExactly(ERROR_RESPONSE)).to.be.true;
      });
    });
  });
});
