import shell from 'shelljs';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';

import { users } from '../../mocks/users';
import { tasks } from '../../mocks/tasks';
import { app } from '../../../src/app';

chai.use(chaiHTTP);

const [{ email, password }] = users;
const [{ id }] = tasks;

const LOGIN_USERS_ENDPOINT = '/v1/api/users/login';
const DELETE_TASKS_ENDPOINT = `/v1/api/tasks/${id}`;
const PRISMA_MIGRATE_RESET = 'npx prisma migrate reset --force --skip-generate';

describe('Test DELETE endpoint "/tasks/:id"', function () {
  this.timeout(5000);

  let token: string;

  before(async () => {
    shell.exec(PRISMA_MIGRATE_RESET, { silent: true });

    await chai
      .request(app)
      .post(LOGIN_USERS_ENDPOINT)
      .send({ email, password })
      .then((res) => {
        token = res.body.token;
      });
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
