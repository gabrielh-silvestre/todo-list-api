import { v4 as uuidV4 } from 'uuid';

import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import Sinon from 'sinon';

import { UserRepository } from '../../../modules/users/repository/UsersRepository';

import { users, newUser } from '../../mocks/users';
import { app } from '../../../app';

chai.use(chaiHTTP);
const CREATE_USERS_ENDPOINT = '/v1/api/users/create';

describe('Test POST endpoint "/users/create"', () => {
  const { email, username, password } = newUser;

  let repositoryFindByEmailStub: Sinon.SinonStub;
  let repositoryCreateStub: Sinon.SinonStub;

  before(() => {
    repositoryFindByEmailStub = Sinon.stub(
      UserRepository.prototype,
      'findByEmail'
    );
    repositoryCreateStub = Sinon.stub(UserRepository.prototype, 'create');
  });

  after(() => {
    repositoryFindByEmailStub.restore();
    repositoryCreateStub.restore();
  });

  describe('Success case', () => {
    before(() => {
      repositoryFindByEmailStub.resolves(null);
      repositoryCreateStub.resolves(uuidV4());
    });

    describe('Should return a success status with a new token', () => {
      it('status code should be 201', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.status).to.be.equal(201);
      });

      it('response body should have "token" property', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.body).to.have.property('token');
      });
    });
  });

  describe('Error cases', () => {
    describe('Invalid data', () => {
      describe('Create user with invalid email', () => {
        it('should return a status code 400', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ email: 'invalid', username, password });

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ email: 'invalid', username, password });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "email" must be a valid email', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ email: 'invalid', username, password });

          expect(response.body.message).to.be.equal(
            '"email" must be a valid email'
          );
        });
      });

      describe('Create user without email', () => {
        it('should return a status code 400', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ username, password });

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ username, password });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "email" is required', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ username, password });

          expect(response.body.message).to.be.equal('"email" is required');
        });
      });

      describe('Create user with invalid username', () => {
        describe('username with less than 3 characters', () => {
          it('should return a status code 400', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username: 'in', password });

            expect(response.status).to.be.equal(400);
          });

          it('should return a response with "message" property', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username: 'in', password });

            expect(response.body).to.have.property('message');
          });

          it('message should be: "username" length must be at least 3 characters long', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username: 'in', password });

            expect(response.body.message).to.be.equal(
              '"username" length must be at least 3 characters long'
            );
          });
        });

        describe('username with more than 10 characters', () => {
          it('should return a status code 400', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username: 'invalidusername', password });

            expect(response.status).to.be.equal(400);
          });

          it('should return a response with "message" property', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username: 'invalidusername', password });

            expect(response.body).to.have.property('message');
          });

          it('message should be: "username" length must be less than or equal to 10 characters long', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username: 'invalidusername', password });

            expect(response.body.message).to.be.equal(
              '"username" length must be less than or equal to 10 characters long'
            );
          });
        });
      });

      describe('Create user without username', () => {
        it('should return a status code 400', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ email, password });

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ email, password });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "username" is required', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ email, password });

          expect(response.body.message).to.be.equal('"username" is required');
        });
      });

      describe('Create user with invalid password', () => {
        describe('password with less than 6 characters', () => {
          it('should return a status code 400', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username, password: 'in' });

            expect(response.status).to.be.equal(400);
          });

          it('should return a response with "message" property', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username, password: 'in' });

            expect(response.body).to.have.property('message');
          });

          it('message should be: "password" length must be at least 6 characters long', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username, password: 'in' });

            expect(response.body.message).to.be.equal(
              '"password" length must be at least 6 characters long'
            );
          });
        });

        describe('password with more than 16 characters', () => {
          it('should return a status code 400', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username, password: 'invalidpassword123456' });

            expect(response.status).to.be.equal(400);
          });

          it('should return a response with "message" property', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username, password: 'invalidpassword123456' });

            expect(response.body).to.have.property('message');
          });

          it('message should be: "password" length must be less than or equal to 16 characters long', async () => {
            const response = await chai
              .request(app)
              .post(CREATE_USERS_ENDPOINT)
              .send({ email, username, password: 'invalidpassword123456' });

            expect(response.body.message).to.be.equal(
              '"password" length must be less than or equal to 16 characters long'
            );
          });
        });
      });

      describe('Create user without password', () => {
        it('should return a status code 400', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ email, username });

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ email, username });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "password" is required', async () => {
          const response = await chai
            .request(app)
            .post(CREATE_USERS_ENDPOINT)
            .send({ email, username });

          expect(response.body.message).to.be.equal('"password" is required');
        });
      });
    });

    describe('Create user with a already registered email', () => {
      before(() => {
        repositoryFindByEmailStub.resolves(users[0]);
      });

      it('should return a status code 409', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.status).to.be.equal(409);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.body).to.have.property('message');
      });

      it('message should be: User already exists', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.body.message).to.be.equal('User already exists');
      });
    });
  });

  describe('Database errors', () => {
    describe('Error in while checking user uniqueness', () => {
      before(() => {
        repositoryFindByEmailStub.rejects();
      });

      it('should return a status code 500', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.status).to.be.equal(500);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.body).to.have.property('message');
      });

      it('message should be: Internal server error', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.body.message).to.be.equal(
          'Internal server error'
        );
      });
    });

    describe('Error in while creating user', () => {
      before(() => {
        repositoryFindByEmailStub.resolves(null);
        repositoryCreateStub.rejects();
      });

      it('should return a status code 500', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.status).to.be.equal(500);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.body).to.have.property('message');
      });

      it('message should be: Internal server error', async () => {
        const response = await chai
          .request(app)
          .post(CREATE_USERS_ENDPOINT)
          .send({ email, username, password });

        expect(response.body.message).to.be.equal(
          'Internal server error'
        );
      });
    });
  });
});
