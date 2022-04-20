import { User } from '@prisma/client';
import { expect } from 'chai';
import Sinon from 'sinon';

import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode } from '../../../../@types/types';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { UniqueUserUseCase } from '../../../../modules/users/useCases/uniqueUser/UniqueUserUseCase';

import { BaseError } from '../../../../utils/Errors/BaseError';

const { CONFLICT, INTERNAL_SERVER_ERROR } = ErrorStatusCode;
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
        const response = (await uniqueUserUseCase.execute(
          email
        )) as ISuccess<null>;

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

    describe('Should throw a stringfy error with status and message', () => {
      const { email } = NEW_USER;

      it('status should be "CONFLICT"', async () => {
        try {
          await uniqueUserUseCase.execute(email);
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.getBody().errorCode).to.be.equal(CONFLICT);
        }
      });

      it('message should be "User already exists"', async () => {
        try {
          await uniqueUserUseCase.execute(email);
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.message).to.be.equal('User already exists');
        }
      });
    });
  });

  describe('Database error case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(userRepository, 'findByEmail').rejects();
    });

    after(() => {
      findByEmailStub.restore();
    });

    describe('Should throw a CustomError with status and message', () => {
      const { email } = NEW_USER;

      it('status should be "INTERNAL_SERVER_ERROR"', async () => {
        try {
          await uniqueUserUseCase.execute(email);
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.getBody().errorCode).to.be.equal(INTERNAL_SERVER_ERROR);
        }
      });

      it('message should be "Unexpected error while checking user uniqueness"', async () => {
        try {
          await uniqueUserUseCase.execute(email);
          expect.fail('Should throw an error');
        } catch (err) {
          const tErr = err as BaseError;
          expect(tErr.message).to.be.equal(
            'Unexpected error while checking user uniqueness'
          );
        }
      });
    });
  });
});
