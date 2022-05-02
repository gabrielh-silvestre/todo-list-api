import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';
import { ErrorStatusCode } from '../../../../src/@types/types';

import { EncryptService } from '../../../../src/services/Encrypt';
import { AuthService } from '../../../../src/services/Auth';
import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../src/modules/users/useCases/loginUser/LoginUserUseCase';

import { BaseError } from '../../../../src/utils/Errors/BaseError';
import { users, newUser } from '../../../mocks/users';

const { NOT_FOUND } = ErrorStatusCode;
const FAKE_TOKEN = 'nASOmifoniv-auns09812jsnipoas-wpnioAa09sjvcawh012';

const encryptService = new EncryptService();
const authService = new AuthService();
const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  authService,
  encryptService
);

describe('Test LoginUserUseCase', () => {
  const [user] = users;
  const { email, password } = newUser;

  let findByEmailStub: Sinon.SinonStub;
  let createTokenStub: Sinon.SinonStub;
  let verifyPasswordStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
        user
      );

      createTokenStub = Sinon.stub(authService, 'createToken').returns(
        FAKE_TOKEN
      );

      verifyPasswordStub = Sinon.stub(encryptService, 'verify').resolves(true);
    });

    after(() => {
      findByEmailStub.restore();
      createTokenStub.restore();
      verifyPasswordStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      it('success status should be "OK"', async () => {
        const response = (await loginUserUseCase.execute({
          email,
          password,
        })) as ISuccess<string>;

        expect(response.statusCode).to.be.equal('OK');
      });

      it('data should be a authorization token', async () => {
        const response = (await loginUserUseCase.execute({
          email,
          password,
        })) as unknown as ISuccess<User>;

        expect(response.data).to.be.equal(FAKE_TOKEN);
      });
    });
  });

  describe('Error cases', () => {
    describe('Not found user', () => {
      before(() => {
        findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
          null
        );
      });

      after(() => {
        findByEmailStub.restore();
      });

      describe('Should throw a CustomError with status and message', () => {
        it('status should be "NOT_FOUND"', async () => {
          try {
            await loginUserUseCase.execute({
              email,
              password,
            });
            expect.fail('Should throw an error');
          } catch (err) {
            const tErr = err as BaseError;
            expect(tErr.getBody().errorCode).to.be.equal(NOT_FOUND);
          }
        });

        it('message should be "Invalid email or password"', async () => {
          try {
            await loginUserUseCase.execute({
              email,
              password,
            });
            expect.fail('Should throw an error');
          } catch (err) {
            const tErr = err as BaseError;
            expect(tErr.message).to.be.equal('Invalid email or password');
          }
        });
      });
    });

    describe('Invalid password', () => {
      before(() => {
        findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
          user
        );
      });

      after(() => {
        findByEmailStub.restore();
      });

      describe('Should throw a CustomError with status and message', () => {
        it('status should be "NOT_FOUND"', async () => {
          try {
            await loginUserUseCase.execute({
              email,
              password: 'invalidPassword',
            });
            expect.fail('Should throw an error');
          } catch (err) {
            const tErr = err as BaseError;
            expect(tErr.getBody().errorCode).to.be.equal(NOT_FOUND);
          }
        });

        it('message should be "Invalid email or password"', async () => {
          try {
            await loginUserUseCase.execute({
              email,
              password: 'invalidPassword',
            });
            expect.fail('Should throw an error');
          } catch (err) {
            const tErr = err as BaseError;
            expect(tErr.message).to.be.equal('Invalid email or password');
          }
        });
      });
    });
  });
});
