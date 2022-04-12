import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';
import { ISuccess } from '../../../../@types/statusCodes';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { CreateUserUseCase } from '../../../../modules/users/useCases/createUser/CreateUserUseCase';
import { EncriptService } from '../../../../services/Encript';

const NEW_USER: User = {
  id: '5',
  email: 'person5@email.com',
  username: 'person5',
  password: '123456',
};

const encriptService = new EncriptService();
const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository, encriptService);

describe('Test CreateUserCase', () => {
  let createStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      createStub = Sinon
        .stub(userRepository, 'create')
        .resolves(NEW_USER);
    });

    after(() => {
      createStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      const { email, username, password } = NEW_USER;

      it('success status should be "CREATED"', async () => {
        const response = await createUserUseCase.execute({
          email,
          username,
          password,
        });

        expect(response.statusCode).to.be.equal('CREATED');
      });

      it('data should be the created User', async () => {
        const response = await createUserUseCase.execute({
          email,
          username,
          password,
        }) as ISuccess<User>;

        expect(response.data).to.be.deep.equal(NEW_USER);
      });
    });
  });
});
