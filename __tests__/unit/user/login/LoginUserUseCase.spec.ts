import { expect } from 'chai';
import Sinon from 'sinon';

import { EncryptService } from '../../../../src/services/Encrypt';
import { AuthService } from '../../../../src/services/Auth';

import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { loginUserUseCase } from '../../../../src/modules/users/useCases/loginUser';

import { users, newUser } from '../../../mocks/users';

const [user] = users;

const FAKE_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

describe('Test LoginUserUseCase', () => {
  let findByEmailStub: Sinon.SinonStub;
  let createTokenStub: Sinon.SinonStub;
  let verifyPasswordStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(UserRepository.prototype, 'findByEmail');
      findByEmailStub.resolves(user);

      createTokenStub = Sinon.stub(AuthService, 'createToken');
      createTokenStub.returns(FAKE_TOKEN);

      verifyPasswordStub = Sinon.stub(EncryptService, 'verify');
      verifyPasswordStub.returns(true);
    });

    after(() => {
      findByEmailStub.restore();
      createTokenStub.restore();
      verifyPasswordStub.restore();
    });

    it('Should return a object with an status code and data', async () => {
      const response = await loginUserUseCase.execute(newUser);

      expect(response).to.be.an('object');
      expect(response).to.have.property('statusCode');
      expect(response).to.have.property('data');

      expect(response.statusCode).to.be.equal(200);
      expect(response.data).to.be.an('object');
      expect(response.data).to.have.property('token');
      expect(response.data.token).to.be.an('string');
    });
  });

  describe('Error cases', () => {
    describe('Invalid "email" case', () => {
      before(() => {
        findByEmailStub = Sinon.stub(UserRepository.prototype, 'findByEmail');
        findByEmailStub.resolves(null);
      });

      after(() => {
        findByEmailStub.restore();
      });

      it('should throw an error with status code and message', async () => {
        try {
          await loginUserUseCase.execute(newUser);
          expect.fail('Should throw an error');
        } catch (err) {
          expect(err).to.have.property('statusCode');
          expect(err).to.have.property('message');

          expect(err.statusCode).to.be.equal(404);
          expect(err.message).to.be.equal('Invalid email or password');
        }
      });
    });

    describe('Invalid "password" case', () => {
      before(() => {
        findByEmailStub = Sinon.stub(UserRepository.prototype, 'findByEmail');
        findByEmailStub.resolves(user);
      });

      after(() => {
        findByEmailStub.restore();
      });

      it('should throw an error with status code and message', async () => {
        try {
          await loginUserUseCase.execute(newUser);
          expect.fail('Should throw an error');
        } catch (err) {
          expect(err).to.have.property('statusCode');
          expect(err).to.have.property('message');

          expect(err.statusCode).to.be.equal(404);
          expect(err.message).to.be.equal('Invalid email or password');
        }
      });
    });
  });
});
