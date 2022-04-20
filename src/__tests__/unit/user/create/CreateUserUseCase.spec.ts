import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode } from '../../../../@types/types';

import { AuthService } from '../../../../services/Auth';
import { EncriptService } from '../../../../services/Encript';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { CreateUserUseCase } from '../../../../modules/users/useCases/createUser/CreateUserUseCase';

import { BaseError } from '../../../../utils/Errors/BaseError';
import { InternalError } from '../../../../utils/Errors';

const { INTERNAL_SERVER_ERROR } = ErrorStatusCode;
const MOCK_USER: User = {
  id: '5',
  email: 'person5@email.com',
  username: 'person5',
  password: '123456',
};

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const authService = new AuthService();
const encriptService = new EncriptService();
const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(
  userRepository,
  authService,
  encriptService
);

describe('Test CreateUserCase', () => {
  let createStub: Sinon.SinonStub;
  let createTokenStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      createStub = Sinon.stub(userRepository, 'create').resolves(FAKE_TOKEN);

      createTokenStub = Sinon.stub(authService, 'createToken').returns(
        FAKE_TOKEN
      );
    });

    after(() => {
      createStub.restore();
      createTokenStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      const { email, username, password } = MOCK_USER;

      it('success status should be "CREATED"', async () => {
        const response = (await createUserUseCase.execute({
          email,
          username,
          password,
        })) as ISuccess<string>;

        expect(response.statusCode).to.be.equal('CREATED');
      });

      it('data should be the created token', async () => {
        const response = (await createUserUseCase.execute({
          email,
          username,
          password,
        })) as ISuccess<string>;

        expect(response.data).to.be.deep.equal(FAKE_TOKEN);
      });
    });
  });

  describe('Database error case', () => {
    const ERROR = new InternalError(
      'Unexpected error while creating user',
      'test env'
    );

    before(() => {
      createStub = Sinon.stub(userRepository, 'create').rejects(ERROR);
    });

    after(() => {
      createStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      const { email, username, password } = MOCK_USER;

      it('status should be "INTERNAL_SERVER_ERROR"', async () => {
        try {
          await createUserUseCase.execute({
            email,
            username,
            password,
          });
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.getBody().errorCode).to.be.equal(INTERNAL_SERVER_ERROR);
        }
      });

      it('message should be "Unexpected error while creating user"', async () => {
        try {
          await createUserUseCase.execute({
            email,
            username,
            password,
          });
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.message).to.be.equal(
            'Unexpected error while creating user'
          );
        }
      });
    });
  });
});
