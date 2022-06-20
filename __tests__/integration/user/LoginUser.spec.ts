import { HttpError } from 'restify-errors';
import shell from 'shelljs';

import Sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';

import { ISignResponse } from '../../../src/@types/interfaces';

import { AuthService } from '../../../src/services/Auth';

import { users, newUser } from '../../mocks/users';
import { app } from '../../../src/app';

chai.use(chaiHTTP);

const LOGIN_USERS_ENDPOINT = '/v1/api/users/login';
const PRISMA_SEED_RESET = 'npx prisma db seed';

const [{ id, email, username }] = users;
const loginUserCredentials = { email, password: '123a45' };

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const SUCCESS_RESPONSE: ISignResponse = {
  token: FAKE_TOKEN,
  user: {
    id: id,
    user_metadata: { username: username },
    aud: '',
    app_metadata: {},
    created_at: '',
  },
};

describe('Test POST endpoint "/users/login"', function () {
  this.timeout(5000);

  let authStub: Sinon.SinonStub;

  before(() => {
    shell.exec(PRISMA_SEED_RESET, { silent: true });
  });

  describe('Success case', () => {
    before(() => {
      authStub = Sinon.stub(AuthService.prototype, 'signIn');
      authStub.resolves(SUCCESS_RESPONSE);
    });

    after(() => {
      authStub.restore();
    });

    it('should return a success status with a new token', async () => {
      const response = await chai
        .request(app)
        .post(LOGIN_USERS_ENDPOINT)
        .send(loginUserCredentials);

      expect(response).to.have.status(200);
      expect(response.body).to.have.property('token');
    });
  });

  describe('Error cases', () => {
    describe('Invalid "email" cases', () => {
      before(() => {
        authStub = Sinon.stub(AuthService.prototype, 'signIn');
        authStub.rejects(
          new HttpError({ statusCode: 404 }, 'Invalid email or password')
        );
      });

      after(() => {
        authStub.restore();
      });

      it('should not login user without email', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ ...loginUserCredentials, email: undefined });

        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"email" is required');
      });

      it('should not login user with invalid email', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ ...loginUserCredentials, email: 'invalid-email' });

        expect(response).to.have.status(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"email" must be a valid email'
        );
      });

      it('should not login user with unregistered email', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send(loginUserCredentials);

        expect(response).to.have.status(404);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Invalid email or password');
      });
    });

    describe('Invalid "password" cases', () => {
      before(() => {
        authStub = Sinon.stub(AuthService.prototype, 'signIn');
        authStub.rejects(
          new HttpError({ statusCode: 404 }, 'Invalid email or password')
        );
      });

      after(() => {
        authStub.restore();
      });

      it('should not login user without password', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email });

        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"password" is required');
      });

      it('should not login user with invalid password', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password: '123456' });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Invalid email or password');
      });
    });
  });
});
