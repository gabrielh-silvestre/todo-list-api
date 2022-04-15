import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';

import { EncriptService } from '../../../../services/Encript';
import { AuthService } from '../../../../services/Auth';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../modules/users/useCases/loginUser/LoginUserUseCase';

import { CustomError } from '../../../../utils/CustomError';

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
        const response = await loginUserUseCase.execute({
          email,
          password,
        }) as ISuccess<string>;

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
            const tErr = err as CustomError;
            expect(tErr.statusCode).to.be.equal('NOT_FOUND');
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
            const tErr = err as CustomError;
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
            const tErr = err as CustomError;
            expect(tErr.statusCode).to.be.equal('NOT_FOUND');
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
            const tErr = err as CustomError;
            expect(tErr.message).to.be.equal('Invalid email or password');
          }
        });
      });
    });
  });

  describe('Database error case', () => {
    const { email, password } = MOCK_USER;

    before(() => {
      findByEmailStub = Sinon.stub(userRepository, 'findByEmail').rejects();
    });

    after(() => {
      findByEmailStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      it('status should be "INTERNAL_SERVER_ERROR"', async () => {
        try {
          await loginUserUseCase.execute({
            email,
            password,
          });
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as CustomError;
          expect(tErr.statusCode).to.be.equal('INTERNAL_SERVER_ERROR');
        }
      });

      it('message should be "Unexpected error while login user"', async () => {
        try {
          await loginUserUseCase.execute({
            email,
            password,
          });
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as CustomError;
          expect(tErr.message).to.be.equal('Unexpected error while login user');
        }
      });
    });
  });
});
