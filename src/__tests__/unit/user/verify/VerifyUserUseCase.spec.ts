import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode } from '../../../../@types/types';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { VerifyUserUseCase } from '../../../../modules/users/useCases/verifyUser/VerifyUserUseUseCase';

import { BaseError } from '../../../../utils/Errors/BaseError';

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = ErrorStatusCode;
const MOCK_USER: User = {
  id: '1',
  email: 'person1@email.com',
  username: 'person1',
  password: '123a456',
};

const userRepository = new UserRepository();
const verifyUserUseCase = new VerifyUserUseCase(userRepository);

describe('Test VerifyUserUseCase', () => {
  const { id } = MOCK_USER;
  let findByIdStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByIdStub = Sinon.stub(userRepository, 'findById').resolves(MOCK_USER);
    });

    after(() => {
      findByIdStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "OK"', async () => {
        const response = (await verifyUserUseCase.execute(
          id
        )) as ISuccess<null>;

        expect(response.statusCode).to.be.equal('OK');
      });

      it('data should be null', async () => {
        const response = (await verifyUserUseCase.execute(
          id
        )) as ISuccess<null>;

        expect(response.data).to.be.null;
      });
    });
  });

  describe('Error case', () => {
    before(() => {
      findByIdStub = Sinon.stub(userRepository, 'findById').resolves(null);
    });

    after(() => {
      findByIdStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      it('status should be "NOT_FOUND"', async () => {
        try {
          await verifyUserUseCase.execute(id);
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.getBody().errorCode).to.be.equal(NOT_FOUND);
        }
      });

      it('message should be "User does not exist"', async () => {
        try {
          await verifyUserUseCase.execute(id);
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.message).to.be.equal('User does not exist');
        }
      });
    });
  });
});
