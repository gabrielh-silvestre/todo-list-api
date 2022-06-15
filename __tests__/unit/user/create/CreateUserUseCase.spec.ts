import { expect } from 'chai';
import Sinon from 'sinon';

import { AuthService } from '../../../../src/services/Auth';
import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { createUserUseCase } from '../../../../src/modules/users/useCases/createUser';

import { users, newUser } from '../../../mocks/users';

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const [user] = users;

describe('Test CreateUserCase', () => {
  let findByEmailStub: Sinon.SinonStub;
  let createStub: Sinon.SinonStub;
  let createTokenStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(UserRepository.prototype, 'findByEmail');
      findByEmailStub.resolves(null);

      createStub = Sinon.stub(UserRepository.prototype, 'create');
      createStub.resolves(FAKE_TOKEN);

      createTokenStub = Sinon.stub(AuthService, 'createToken');
      createTokenStub.returns(FAKE_TOKEN);
    });

    after(() => {
      findByEmailStub.restore();
      createStub.restore();
      createTokenStub.restore();
    });

    it('should return a object with an status code and data', async () => {
      const response = await createUserUseCase.execute(newUser);

      expect(response).to.be.an('object');
      expect(response).to.have.property('statusCode');
      expect(response).to.have.property('data');

      expect(response.statusCode).to.be.equal(201);
      expect(response.data).to.be.an('string');
    });
  });

  describe('Error case', () => {
    describe('Invalid "email" case', () => {
      before(() => {
        findByEmailStub = Sinon.stub(UserRepository.prototype, 'findByEmail');
        findByEmailStub.resolves(user);
      });

      after(() => {
        findByEmailStub.restore();
      });

      it('should throw an error with status code and message', async () => {
        try {
          await createUserUseCase.execute(newUser);
          expect.fail();
        } catch (err) {
          expect(err).to.have.property('statusCode');
          expect(err).to.have.property('message');

          expect(err.statusCode).to.be.equal(409);
          expect(err.message).to.be.equal('User already exists');
        }
      });
    });
  });
});
