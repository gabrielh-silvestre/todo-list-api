import shell from 'shelljs';

import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';

import { users, newUser } from '../../mocks/users';
import { app } from '../../../src/app';

chai.use(chaiHTTP);
const CREATE_USERS_ENDPOINT = '/v1/api/users/create';
const PRISMA_MIGRATE_RESET = 'npx prisma migrate reset --force --skip-generate';

const { email, username, password } = newUser;
const [existingUser] = users;

describe.only('Test POST endpoint "/users/create"', function () {
  this.timeout(5000);

  before(() => {
    shell.exec(PRISMA_MIGRATE_RESET, { silent: true });
  });

  describe('Success case', () => {
    it('should return a success status with a new token', async () => {
      const response = await chai
        .request(app)
        .post(CREATE_USERS_ENDPOINT)
        .send({ email, username, password });

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
          .send({ username, password });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"email" is required');
      });

      it('should not create user with invalid email', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email: 'invalid', username, password });

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
          .send({ email, password });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"username" is required');
      });

      it('should not create user when username has less than 3 characters', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username: 'in', password });

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
          .send({ email, username: 'invalidusername', password });

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
          .send({ email, username });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"password" is required');
      });

      it('should not create user when password has less than 6 characters', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password: 'in' });

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
          .send({ email, username, password: 'invalidpassword123456' });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"password" length must be less than or equal to 16 characters long'
        );
      });
    });

    describe('Duplicate "email" cases', () => {
      it('should not create user with an already registered email', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({
            email: existingUser.email,
            username: existingUser.username,
            password: existingUser.password,
          });

        expect(response.status).to.be.equal(409);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('User already exists');
      });
    });
  });
});
