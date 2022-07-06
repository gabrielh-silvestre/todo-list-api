import { HttpError } from 'restify-errors';
import { expect } from 'chai';
import Sinon from 'sinon';

import { SignReturn } from '../../../../src/typings/types';

import { AuthService } from '../../../../src/shared/services/Auth';
import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { createUserUseCase } from '../../../../src/modules/users/useCases/createUser';

import { users, newUser } from '../../../mocks/users';

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

describe('Test CreateUserCase', () => {
  let findByEmailStub: Sinon.SinonStub;
  let createStub: Sinon.SinonStub;
  let signUpStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByEmailStub = Sinon.stub(UserRepository.prototype, 'findByEmail');
      findByEmailStub.resolves(null);

      createStub = Sinon.stub(UserRepository.prototype, 'create');
      createStub.resolves(FAKE_TOKEN);

      signUpStub = Sinon.stub(AuthService.prototype, 'signUp');
      signUpStub.resolves(SUCCESS_RESPONSE);
    });

    after(() => {
      findByEmailStub.restore();
      createStub.restore();
      signUpStub.restore();
    });

    it('should return a object with an status code and data', async () => {
      const response = await createUserUseCase.execute({
        ...newUser,
        password: '123a45',
      });

      expect(response).to.be.an('object');
      expect(response).to.have.property('statusCode');
      expect(response).to.have.property('data');

      expect(response.statusCode).to.be.equal(201);
      expect(response.data).to.be.an('object');
      expect(response.data).to.have.property('token');
      expect(response.data.token).to.be.an('string');
    });
  });

  describe('Error case', () => {
    describe('Invalid "email" case', () => {
      before(() => {
        findByEmailStub = Sinon.stub(UserRepository.prototype, 'findByEmail');
        findByEmailStub.resolves(user);

        signUpStub = Sinon.stub(AuthService.prototype, 'signUp');
        signUpStub.rejects(new HttpError({ statusCode: 409 }, 'User already exists'));
      });

      after(() => {
        findByEmailStub.restore();
      });

      it('should throw an error with status code and message', async () => {
        try {
          await createUserUseCase.execute({
            ...newUser,
            password: '123a45',
          });
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
