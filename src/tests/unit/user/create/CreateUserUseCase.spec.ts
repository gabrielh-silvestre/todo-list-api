import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';

import { AuthService } from '../../../../services/Auth';
import { EncriptService } from '../../../../services/Encript';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { CreateUserUseCase } from '../../../../modules/users/useCases/createUser/CreateUserUseCase';

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
        const response = await createUserUseCase.execute({
          email,
          username,
          password,
        });

        expect(response.statusCode).to.be.equal('CREATED');
      });

      it('data should be the created token', async () => {
        const response = (await createUserUseCase.execute({
          email,
          username,
          password,
        })) as ISuccess<string>;

        console.log({ response, data: response.data });

        expect(response.data).to.be.deep.equal(FAKE_TOKEN);
      });
    });
  });
});
