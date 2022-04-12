import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { IError, ISuccess } from '../../../../@types/interfaces';

import { EncriptService } from '../../../../services/Encript';
import { AuthService } from '../../../../services/Auth';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../modules/users/useCases/loginUser/LoginUserUseCase';

const USER: User = {
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
        USER
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
      const { email, password } = USER;

      it('success status should be "OK"', async () => {
        const response = await loginUserUseCase.execute({
          email,
          password,
        });

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

  describe('Failure cases', () => {
    const { email, password } = USER;

    describe('not found user', () => {
      before(() => {
        findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
          null
        );
      });

      after(() => {
        findByEmailStub.restore();
      });

      describe('Should return a object with an error status and message', () => {
        it('status should be "NOT_FOUND"', async () => {
          const response = await loginUserUseCase.execute({
            email,
            password,
          });

          expect(response.statusCode).to.be.equal('NOT_FOUND');
        });

        it('message should be "Invalid email or password"', async () => {
          const response = (await loginUserUseCase.execute({
            email,
            password,
          })) as IError;

          expect(response.message).to.be.equal('Invalid email or password');
        });
      });
    });

    describe('invalid password', () => {
      before(() => {
        findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
          USER
        );
      });

      after(() => {
        findByEmailStub.restore();
      });

      describe('Should return a object with an error status and message', () => {
        it('status should be "NOT_FOUND"', async () => {
          const response = await loginUserUseCase.execute({
            email,
            password: '123456',
          });

          expect(response.statusCode).to.be.equal('NOT_FOUND');
        });

        it('message should be "Invalid email or password"', async () => {
          const response = (await loginUserUseCase.execute({
            email,
            password: '123456',
          })) as IError;

          expect(response.message).to.be.equal('Invalid email or password');
        });
      });
    });
  });
});
