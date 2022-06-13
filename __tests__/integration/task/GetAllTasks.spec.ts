import shell from 'shelljs';
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';

import { users } from '../../mocks/users';
import { app } from '../../../src/app';

chai.use(chaiHTTP);

const [{ email, password }] = users;

const LOGIN_USERS_ENDPOINT = '/v1/api/users/login';
const LIST_TASKS_ENDPOINT = '/v1/api/tasks';
const PRISMA_MIGRATE_RESET = 'npx prisma migrate reset --force --skip-generate';

describe('Test GET endpoint "/tasks"', function () {
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
    it('should return  a success status with all tasks', async () => {
      const response = await chai
        .request(app)
        .get(LIST_TASKS_ENDPOINT)
        .set('Authorization', token);

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('array');

      expect(response.body[0]).to.be.an('object');
      expect(response.body[0]).to.have.property('id');
      expect(response.body[0]).to.have.property('title');
      expect(response.body[0]).to.have.property('description');
      expect(response.body[0]).to.have.property('status');
      expect(response.body[0]).to.have.property('updatedAt');
      expect(response.body[0]).to.not.have.property('userId');
    });
  });

  describe('Error cases', () => {
    describe('Invalid "authorization" cases', () => {
      it('should not update a task without authorization', async () => {
        const response = await chai.request(app).get(LIST_TASKS_ENDPOINT);

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('No authorization header');
      });

      it('should not update a task with invalid authorization', async () => {
        const response = await chai
          .request(app)
          .get(LIST_TASKS_ENDPOINT)
          .set('Authorization', 'invalid-token');

        expect(response.status).to.be.equal(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal('Expired or invalid token');
      });
    });
  });
});
