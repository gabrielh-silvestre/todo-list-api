import { HttpError } from 'restify-errors';

import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';
import { ErrorStatusCode } from '../../../../src/@types/types';

import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { VerifyUserUseCase } from '../../../../src/modules/users/useCases/verifyUser/VerifyUserUseUseCase';

import { users } from '../../../mocks/users';

const { NOT_FOUND } = ErrorStatusCode;

const userRepository = new UserRepository();
const verifyUserUseCase = new VerifyUserUseCase(userRepository);

describe('Test VerifyUserUseCase', () => {
  const [{ id }, user] = users;
  let findByIdStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByIdStub = Sinon.stub(userRepository, 'findById').resolves(user);
    });

    after(() => {
      findByIdStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "OK"', async () => {
        const response = (await verifyUserUseCase.execute({
          id,
        })) as ISuccess<null>;

        expect(response.statusCode).to.be.equal('OK');
      });

      it('data should be null', async () => {
        const response = (await verifyUserUseCase.execute({
          id,
        })) as ISuccess<null>;

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
          await verifyUserUseCase.execute({ id });
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as HttpError;
          expect(tErr.statusCode).to.be.equal(NOT_FOUND);
        }
      });

      it('message should be "User does not exist"', async () => {
        try {
          await verifyUserUseCase.execute({ id });
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as HttpError;
          expect(tErr.message).to.be.equal('User does not exist');
        }
      });
    });
  });
});
