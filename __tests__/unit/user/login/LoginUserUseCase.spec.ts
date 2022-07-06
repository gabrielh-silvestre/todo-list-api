import { expect } from 'chai';
import Sinon from 'sinon';

import { SignReturn } from '../../../../src/@types/types';

import { AuthService } from '../../../../src/shared/services/Auth';

import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { loginUserUseCase } from '../../../../src/modules/users/useCases/loginUser';

import { users, newUser } from '../../../mocks/users';
import { HttpError } from 'restify-errors';

const [user] = users;

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const SUCCESS_RESPONSE: SignReturn = {
  token: FAKE_TOKEN,
  user: {
    id: user.id,
    user_metadata: { username: user.username },
    aud: '',
    app_metadata: {},
    created_at: '',
  },
};

describe('Test LoginUserUseCase', () => {
  let findByEmailStub: Sinon.SinonStub;
  let signInStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(UserRepository.prototype, 'findByEmail');
      findByEmailStub.resolves(user);

      signInStub = Sinon.stub(AuthService.prototype, 'signIn');
      signInStub.resolves(SUCCESS_RESPONSE);
    });

    after(() => {
      findByEmailStub.restore();
      signInStub.restore();
    });

    it('Should return a object with an status code and data', async () => {
      const response = await loginUserUseCase.execute({
        ...newUser,
        password: '123a45',
      });

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

        signInStub = Sinon.stub(AuthService.prototype, 'signIn');
        signInStub.rejects(
          new HttpError({ statusCode: 404 }, 'Invalid email or password')
        );
      });

      after(() => {
        findByEmailStub.restore();
        signInStub.restore();
      });

      it('should throw an error with status code and message', async () => {
        try {
          await loginUserUseCase.execute({
            ...newUser,
            password: '123a45',
          });
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

        signInStub = Sinon.stub(AuthService.prototype, 'signIn');
        signInStub.rejects(
          new HttpError({ statusCode: 404 }, 'Invalid email or password')
        );
      });

      after(() => {
        findByEmailStub.restore();
        signInStub.restore();
      });

      it('should throw an error with status code and message', async () => {
        try {
          await loginUserUseCase.execute({ ...newUser, password: '123a45' });
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
