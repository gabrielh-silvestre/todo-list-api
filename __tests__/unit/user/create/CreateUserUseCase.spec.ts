import { HttpError } from 'restify-errors';

import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../src/@types/interfaces';

import { AuthService } from '../../../../src/services/Auth';
import { EncryptService } from '../../../../src/services/Encrypt';
import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { CreateUserUseCase } from '../../../../src/modules/users/useCases/createUser/CreateUserUseCase';

import { users, newUser } from '../../../mocks/users';

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(
  userRepository,
  AuthService,
  EncryptService
);

describe('Test CreateUserCase', () => {
  const { email, username, password } = newUser;

  let findByEmailStub: Sinon.SinonStub;
  let createStub: Sinon.SinonStub;
  let createTokenStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
        null
      );

      createStub = Sinon.stub(userRepository, 'create').resolves(FAKE_TOKEN);

      createTokenStub = Sinon.stub(AuthService, 'createToken').returns(
        FAKE_TOKEN
      );
    });

    after(() => {
      findByEmailStub.restore();
      createStub.restore();
      createTokenStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
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

  describe('Error case', () => {
    describe('Email already in use', () => {
      before(() => {
        findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
          users[0]
        );
      });

      after(() => {
        findByEmailStub.restore();
      });

      describe('Should throw a conflict error with status and message', () => {
        it('status should be 409', async () => {
          try {
            await createUserUseCase.execute(newUser);
            expect.fail();
          } catch (err) {
            const tErr = err as HttpError;
            expect(tErr.statusCode).to.be.equal(409);
          }
        });

        it('message should be "User already exists"', async () => {
          try {
            await createUserUseCase.execute(newUser);
            expect.fail();
          } catch (err) {
            const tErr = err as HttpError;
            expect(tErr.message).to.be.equal('User already exists');
          }
        });
      });
    });
  });
});
