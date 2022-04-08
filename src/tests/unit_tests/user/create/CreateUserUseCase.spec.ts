import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';
import { IError, ISuccess } from '../../../../helpers/interfaces';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { CreateUserUseCase } from '../../../../modules/users/useCases/createUser/CreateUserUseCase';
import { users } from '../../../mocks/users';

const NEW_USER: User = {
  id: '5',
  email: 'person5@email.com',
  username: 'person5',
  password: '123456',
};

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);

describe('Test CreateUserCase', () => {
  let findByEmailStub: Sinon.SinonStub;
  let createStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByEmailStub = Sinon
        .stub(userRepository, 'findByEmail')
        .resolves(null);

      createStub = Sinon
        .stub(userRepository, 'create')
        .resolves(NEW_USER);
    });

    after(() => {
      findByEmailStub.restore();
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

  describe('Error case', () => {
    const ERROR_OBJECT: IError = {
      statusCode: 'CONFLICT',
      message: 'User already exists',
    };

    before(() => {
      findByEmailStub = Sinon
        .stub(userRepository, 'findByEmail')
        .resolves(users[0]);

      createStub = Sinon
        .stub(userRepository, 'create')
        .resolves(ERROR_OBJECT as unknown as User);
    });

    after(() => {
      findByEmailStub.restore();
      createStub.restore();
    });

    describe('Should return a object with an error status and message', () => {
      it('error status should be "CONFLICT"', async () => {
        const response = await createUserUseCase.execute(users[0]);

        expect(response.statusCode).to.be.equal('CONFLICT');
      });

      it('message should be "User already exists"', async () => {
        const response = await createUserUseCase.execute(users[0]) as IError;

        expect(response.message).to.be.equal('User already exists');
      });
    });
  });
});
