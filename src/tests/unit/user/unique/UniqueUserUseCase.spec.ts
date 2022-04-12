import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';
import { IError, ISuccess } from '../../../../@types/statusCodes';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { UniqueUserUseCase } from '../../../../modules/users/useCases/uniqueUser/UniqueUserUseCase';

const NEW_USER: User = {
  id: '1',
  email: 'person1@email.com',
  username: 'person1',
  password: '123a456',
};

const userRepository = new UserRepository();
const uniqueUserUseCase = new UniqueUserUseCase(userRepository);

describe('Test UniqueUserUseCase', () => {
  let findByEmailStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
        null
      );
    });

    after(() => {
      findByEmailStub.restore();
    });

    describe('Should return a object with an success status and data', () => {
      const { email } = NEW_USER;

      it('success status should be "OK"', async () => {
        const response = await uniqueUserUseCase.execute(email);

        expect(response.statusCode).to.be.equal('OK');
      });

      it('data should be null', async () => {
        const response = (await uniqueUserUseCase.execute(
          email
        )) as ISuccess<null>;

        expect(response.data).to.be.null;
      });
    });
  });

  describe('Error case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(userRepository, 'findByEmail').resolves(
        NEW_USER
      );
    });

    after(() => {
      findByEmailStub.restore();
    });

    describe('Should return a object with an error status and message', () => {
      const { email } = NEW_USER;

      it('success status should be "CONFLICT"', async () => {
        const response = await uniqueUserUseCase.execute(email);

        expect(response.statusCode).to.be.equal('CONFLICT');
      });

      it('error message should be "User already exists"', async () => {
        const response = (await uniqueUserUseCase.execute(email)) as IError;

        expect(response.message).to.be.equal('User already exists');
      });
    });
  });
});