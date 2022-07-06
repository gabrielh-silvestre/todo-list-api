import { HttpError } from 'restify-errors';
import shell from 'shelljs';

import Sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';

import { SignReturn } from '../../../src/@types/types';

import { AuthService } from '../../../src/shared/services/Auth';

import { users } from '../../mocks/users';
import { tasks } from '../../mocks/tasks';
import { app } from '../../../src/app';

chai.use(chaiHTTP);

const [{ id, email, username }] = users;
const [{ id: taskId }] = tasks;
const loginUserCredentials = { email, password: '123a45' };

const LOGIN_USERS_ENDPOINT = '/v1/api/users/login';
const DELETE_TASKS_ENDPOINT = `/v1/api/tasks/${taskId}`;
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

describe('Test DELETE endpoint "/tasks/:id"', function () {
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
    it('should return a success response with status and empty body', async () => {
      const response = await chai
        .request(app)
        .delete(DELETE_TASKS_ENDPOINT)
        .set('Authorization', token);

      expect(response.status).to.equal(204);
      expect(response.body).to.be.empty;
    });
  });

  describe('Error cases', () => {
    describe('Invalid "authorization" cases', () => {
      it('should not delete a task without authorization', async () => {
        const response = await chai.request(app).delete(DELETE_TASKS_ENDPOINT);

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('No authorization header');
      });

      it('should not delete a task with invalid authorization', async () => {
        getUserStub.rejects(FAIL_SIGN_IN);

        const response = await chai
          .request(app)
          .delete(DELETE_TASKS_ENDPOINT)
          .set('Authorization', 'invalid-token');

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Expired or invalid token');
      });
    });

    describe('"Non-existent" task case', () => {
      it('should not delete a task when task does not exist', async () => {
        const response = await chai
          .request(app)
          .delete('/v1/api/tasks/40')
          .set('Authorization', token);

        expect(response.status).to.be.equal(404);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Task not found');
      });
    });
  });
});
