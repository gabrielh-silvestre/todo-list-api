import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import Sinon from 'sinon';

import { UserRepository } from '../../../modules/users/repository/UsersRepository';

import { newUser } from '../../mocks/users';
import { app } from '../../../app';
import { EncriptService } from '../../../services/Encript';

chai.use(chaiHTTP);

const LOGIN_USERS_ENDPOINT = '/v1/api/users/login';

describe('Test POST endpoint "/users/login"', () => {
  const { email, password } = newUser;

  let repositoryFindByEmailStub: Sinon.SinonStub;
  let encriptVerifyStub: Sinon.SinonStub;

  before(() => {
    repositoryFindByEmailStub = Sinon.stub(
      UserRepository.prototype,
      'findByEmail'
    );

    encriptVerifyStub = Sinon.stub(EncriptService.prototype, 'verify');
  });

  after(() => {
    repositoryFindByEmailStub.restore();
    encriptVerifyStub.restore();
  });

  describe('Success case', () => {
    before(() => {
      repositoryFindByEmailStub.resolves(newUser);
      encriptVerifyStub.resolves(true);
    });

    it('should return a status code 200', async () => {
      const response = await chai
        .request(app)
        .post(LOGIN_USERS_ENDPOINT)
        .send({ email, password });

      expect(response).to.have.status(200);
    });

    it('should return a response with "token" property', async () => {
      const response = await chai
        .request(app)
        .post(LOGIN_USERS_ENDPOINT)
        .send({ email, password });

      expect(response.body).to.have.property('token');
    });
  });

  describe('Error cases', () => {
    describe('Invalid data', () => {
      describe('Login with invalid email', () => {
        it('should return a status code 400', async () => {
          const response = await chai
            .request(app)
            .post(LOGIN_USERS_ENDPOINT)
            .send({ email: 'invalid-email', password });

          expect(response).to.have.status(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(LOGIN_USERS_ENDPOINT)
            .send({ email: 'invalid-email', password });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "email" must be a valid email', async () => {
          const response = await chai
            .request(app)
            .post(LOGIN_USERS_ENDPOINT)
            .send({ email: 'invalid-email', password });

          expect(response.body.message).to.be.equal(
            '"email" must be a valid email'
          );
        });
      });

      describe('Login without email', () => {
        it('should return a status code 400', async () => {
          const response = await chai
            .request(app)
            .post(LOGIN_USERS_ENDPOINT)
            .send({ password });

          expect(response).to.have.status(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(LOGIN_USERS_ENDPOINT)
            .send({ password });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "email" is required', async () => {
          const response = await chai
            .request(app)
            .post(LOGIN_USERS_ENDPOINT)
            .send({ password });

          expect(response.body.message).to.be.equal('"email" is required');
        });
      });

      describe('Login without password', () => {
        it('should return a status code 400', async () => {
          const response = await chai
            .request(app)
            .post(LOGIN_USERS_ENDPOINT)
            .send({ email });

          expect(response).to.have.status(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(LOGIN_USERS_ENDPOINT)
            .send({ email });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "password" is required', async () => {
          const response = await chai
            .request(app)
            .post(LOGIN_USERS_ENDPOINT)
            .send({ email });

          expect(response.body.message).to.be.equal('"password" is required');
        });
      });
    });

    describe('Login an unregistered user', () => {
      before(() => {
        repositoryFindByEmailStub.resolves(null);
      });

      it('should return a status code 404', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password });

        expect(response).to.have.status(404);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password });

        expect(response.body).to.have.property('message');
      });

      it('message should be: Invalid email or password', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password });

        expect(response.body.message).to.be.equal('Invalid email or password');
      });
    });

    describe('Login with invalid password', () => {
      before(() => {
        repositoryFindByEmailStub.resolves(newUser);
        encriptVerifyStub.resolves(false);
      });

      it('should return a status code 404', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password });

        expect(response).to.have.status(404);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password });

        expect(response.body).to.have.property('message');
      });

      it('message should be: Invalid email or password', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password });

        expect(response.body.message).to.be.equal('Invalid email or password');
      });
    });
  });

  describe('Database errors', () => {
    describe('Error while find user email', () => {
      before(() => {
        repositoryFindByEmailStub.rejects();
      });

      it('should return a status code 500', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password });

        expect(response).to.have.status(500);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password });

        expect(response.body).to.have.property('message');
      });

      it('message should be: Internal server error', async () => {
        const response = await chai
          .request(app)
          .post(LOGIN_USERS_ENDPOINT)
          .send({ email, password });

        expect(response.body.message).to.be.equal(
          'Internal server error'
        );
      });
    });
  });
});
