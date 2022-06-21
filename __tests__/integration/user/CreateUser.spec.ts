import { HttpError } from 'restify-errors';
import shell from 'shelljs';

import Sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';

import { SignReturn } from '../../../src/@types/types';

import { AuthService } from '../../../src/services/Auth';

import { newUser } from '../../mocks/users';
import { app } from '../../../src/app';

chai.use(chaiHTTP);

const CREATE_USERS_ENDPOINT = '/v1/api/users/create';
const PRISMA_SEED_RESET = 'npx prisma db seed';

const { id, email, username } = newUser;
const createUserCredentials = { username, email, password: '123a45' };

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const SUCCESS_RESPONSE: SignReturn = {
  token: FAKE_TOKEN,
  user: {
    id: id,
    user_metadata: { username: username },
    aud: '',
    app_metadata: {},
    created_at: '',
  },
};

describe('Test POST endpoint "/users/create"', function () {
  this.timeout(5000);

  let authStub: Sinon.SinonStub;

  before(() => {
    shell.exec(PRISMA_SEED_RESET, { silent: true });
  });

  describe('Success case', () => {
    before(() => {
      authStub = Sinon.stub(AuthService.prototype, 'signUp');
      authStub.resolves(SUCCESS_RESPONSE);
    });

    after(() => {
      authStub.restore();
    });

    it('should return a success status with a new token', async () => {
      const response = await chai
        .request(app)
        .post(CREATE_USERS_ENDPOINT)
        .send(createUserCredentials);

      expect(response.status).to.be.equal(201);
      expect(response.body).to.have.property('token');
    });
  });

  describe('Error cases', () => {
    describe('Invalid "email" cases', () => {
      it('should not create user without email', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ ...createUserCredentials, email: undefined });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"email" is required');
      });

      it('should not create user with invalid email', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ ...createUserCredentials, email: 'invalid-email' });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"email" must be a valid email'
        );
      });
    });

    describe('Invalid "username" cases', () => {
      it('should not create user without username', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ ...createUserCredentials, username: undefined });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"username" is required');
      });

      it('should not create user when username has less than 3 characters', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ ...createUserCredentials, username: 'ab' });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"username" length must be at least 3 characters long'
        );
      });

      it('should not create user when username has more than 10 characters', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ ...createUserCredentials, username: 'abcdefghijkl' });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"username" length must be less than or equal to 10 characters long'
        );
      });
    });

    describe('Invalid "password" cases', () => {
      it('should not create user without password', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ ...createUserCredentials, password: undefined });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"password" is required');
      });

      it('should not create user when password has less than 6 characters', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ ...createUserCredentials, password: '12345' });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"password" length must be at least 6 characters long'
        );
      });

      it('should not create user when password has more than 16 characters', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ ...createUserCredentials, password: '12345678901234567' });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"password" length must be less than or equal to 16 characters long'
        );
      });
    });

    describe('Duplicate "email" cases', () => {
      before(() => {
        authStub = Sinon.stub(AuthService.prototype, 'signUp');
        authStub.rejects(
          new HttpError({ statusCode: 409 }, 'User already exists')
        );
      });

      after(() => {
        authStub.restore();
      });

      it('should not create user with an already registered email', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send(createUserCredentials);

        expect(response.status).to.be.equal(409);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('User already exists');
      });
    });
  });
});
