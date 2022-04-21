import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';
import { ErrorStatusCode } from '../../../../src/@types/types';

import { EncriptService } from '../../../../src/services/Encript';
import { AuthService } from '../../../../src/services/Auth';
import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../src/modules/users/useCases/loginUser/LoginUserUseCase';

import { BaseError } from '../../../../src/utils/Errors/BaseError';

const { NOT_FOUND } = ErrorStatusCode;
const MOCK_USER: User = {
  id: '5',
  email: 'person5@email.com',
  username: 'person5',
  password: '123a456',
};

const FAKE_TOKEN = 'nASOmifoniv-auns09812jsnipoas-wpnioAa09sjvcawh012';

const encriptService = new EncriptService();
const authService = new AuthService();
const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  authService,
  encriptService
);

describe('Test LoginUserUseCase', () => {
  let findByEmailStub: Sinon.SinonStub;
  let createTokenStub: Sinon.SinonStub;
  let verifyPasswordStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
        MOCK_USER
      );

      createTokenStub = Sinon.stub(authService, 'createToken').returns(
        FAKE_TOKEN
      );

      verifyPasswordStub = Sinon.stub(encriptService, 'verify').resolves(true);
    });

    after(() => {
      findByEmailStub.restore();
      createTokenStub.restore();
      verifyPasswordStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      const { email, password } = MOCK_USER;

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
    const { email, password } = MOCK_USER;

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
          MOCK_USER
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
