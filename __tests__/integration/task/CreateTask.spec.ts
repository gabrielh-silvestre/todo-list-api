import { HttpError } from 'restify-errors';
import shell from 'shelljs';

import Sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';

import { SignReturn } from '../../../src/typings/types';

import { AuthService } from '../../../src/shared/services/Auth';

import { newTask } from '../../mocks/tasks';
import { users } from '../../mocks/users';
import { app } from '../../../src/app';

chai.use(chaiHTTP);

const [{ id, email, username }] = users;
const { title, description, status, userId, updatedAt } = newTask;
const loginUserCredentials = { email, password: '123a45' };

const LOGIN_USERS_ENDPOINT = '/v1/api/users/login';
const LIST_TASKS_ENDPOINT = '/v1/api/tasks';
const PRISMA_SEED_RESET = 'npx prisma db seed';

const FAKE_TOKEN = '0n0v19nASV-V0n09Masvmz0-xasvzx';

const FAIL_SIGN_IN = new HttpError(
  { statusCode: 401 },
  'Expired or invalid token'
);

const SUCCESS_SIGN_IN: SignReturn = {
  token: FAKE_TOKEN,
  user: {
    id: id,
    user_metadata: { username: username },
    aud: '',
    app_metadata: {},
    created_at: '',
  },
};

describe('Test POST endpoint "/tasks"', function () {
  this.timeout(5000);

  let token: string;
  let signInStub: Sinon.SinonStub;
  let getUserStub: Sinon.SinonStub;

  before(async () => {
    shell.exec(PRISMA_SEED_RESET, { silent: true });

    signInStub = Sinon.stub(AuthService.prototype, 'signIn');
    signInStub.resolves(SUCCESS_SIGN_IN);

    await chai
      .request(app)
      .post(LOGIN_USERS_ENDPOINT)
      .send(loginUserCredentials)
      .then((res) => {
        token = res.body.token;
      });
  });

  after(() => {
    signInStub.restore();
  });

  beforeEach(() => {
    getUserStub = Sinon.stub(AuthService.prototype, 'getUser');
    getUserStub.resolves({ id, username, email });
  });

  afterEach(() => {
    getUserStub.restore();
  });

  describe('Success case', () => {
    it('Should return a success status with the new task', async () => {
      const response = await chai
        .request(app)
        .post(LIST_TASKS_ENDPOINT)
        .set('Authorization', token)
        .send({ title, description });

      expect(response.status).to.be.equal(201);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('description');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('updatedAt');
      expect(response.body).to.not.have.property('userId');
    });
  });

  describe('Error cases', () => {
    describe('Invalid "authorization" cases', () => {
      it('should not create a task without authorization', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .send({ title, description });

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('No authorization header');
      });

      it('should not create a task with invalid authorization', async () => {
        getUserStub.rejects(FAIL_SIGN_IN);

        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', 'invalid-token')
          .send({ title, description });

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Expired or invalid token');
      });
    });

    describe('Invalid "title" cases', () => {
      it('should not create a task without title', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', token)
          .send({ description });

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"title" is required');
      });

      it('should not create a task when title has less than 5 characters', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', token)
          .send({ title: 'test', description });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"title" length must be at least 5 characters long'
        );
      });

      it('should not create a task when title has more than 20 characters', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', token)
          .send({ title: 'test'.repeat(21), description });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"title" length must be less than or equal to 20 characters long'
        );
      });

      it('should not create a task with duplicated title', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', token)
          .send({ title, description });

        expect(response.status).to.be.equal(409);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          'Task with this title already exists'
        );
      });
    });

    describe('Invalid "description" cases', () => {
      it('should not create a task when description has more than 120 characters', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', token)
          .send({ title, description: 'test'.repeat(121) });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(
          '"description" length must be less than or equal to 120 characters long'
        );
      });
    });

    describe('Invalid "other fields" cases', () => {
      it('should not create a task when gives other fields than "title" and "description"', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', token)
          .send({ title, description, status, userId, updatedAt });

        expect(response.status).to.be.equal(422);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('"status" is not allowed');
      });
    });
  });
});
