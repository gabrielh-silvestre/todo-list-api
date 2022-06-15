import shell from 'shelljs';

import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';

import { users, newUser } from '../../mocks/users';
import { app } from '../../../src/app';

chai.use(chaiHTTP);

const LOGIN_USERS_ENDPOINT = '/v1/api/users/login';
const PRISMA_SEED_RESET = 'npx prisma db seed';

const [{ email, password }] = users;

describe('Test POST endpoint "/users/login"', function () {
  this.timeout(5000);

  before(() => {
    shell.exec(PRISMA_SEED_RESET, { silent: true });
  });

  describe('Success case', () => {
    it('should return a success status with a new token', async () => {
      const response = await chai
        .request(app)
        .post(LOGIN_USERS_ENDPOINT)
        .send({ email, password });

      expect(response).to.have.status(200);
      expect(response.body).to.have.property('token');
    });
  });

  describe('Error cases', () => {
    describe('Invalid "email" cases', () => {
      it('should not login user without email', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ password });

        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"email" is required');
      });

      it('should not login user with invalid email', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email: 'invalid-email', password });

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
          .send({ email: newUser.email, password });

        expect(response).to.have.status(404);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Invalid email or password');
      });
    });

    describe('Invalid "password" cases', () => {
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
