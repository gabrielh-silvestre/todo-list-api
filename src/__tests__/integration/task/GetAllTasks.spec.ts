import 'dotenv/config';

import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import Sinon from 'sinon';

import { UserRepository } from '../../../modules/users/repository/UsersRepository';
import { TasksRepository } from '../../../modules/tasks/repository/TasksRepository';

import { tasks } from '../../mocks/tasks';
import { app } from '../../../app';

chai.use(chaiHTTP);
const LIST_TASKS_ENDPOINT = '/v1/api/tasks';
const FAKE_TOKEN = process.env.TEST_TOKEN as string;

describe('Test GET endpoint "/tasks"', () => {
  const [{ id }] = tasks;

  let userRepositoryFindByIdStub: Sinon.SinonStub;
  let taskRepositoryFindAllStub: Sinon.SinonStub;

  before(() => {
    userRepositoryFindByIdStub = Sinon.stub(
      UserRepository.prototype,
      'findById'
    );
    taskRepositoryFindAllStub = Sinon.stub(
      TasksRepository.prototype,
      'findAll'
    );
  });

  after(() => {
    userRepositoryFindByIdStub.restore();
    taskRepositoryFindAllStub.restore();
  });

  describe('Success case', () => {
    before(() => {
      userRepositoryFindByIdStub.resolves(id);
      taskRepositoryFindAllStub.resolves(tasks);
    });

    describe('Should return  a success status with all tasks', () => {
      it('status code should be 200', async () => {
        const response = await chai
          .request(app)
          .get(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.status).to.be.equal(200);
      });

      it('should return all tasks', async () => {
        const response = await chai
          .request(app)
          .get(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.body).to.be.deep.equal(tasks);
      });
    });
  });

  describe('Error cases', () => {
    describe('Invalid authorization', () => {
      describe('Request without token', () => {
        it('should return status code 401', async () => {
          const response = await chai.request(app).get(LIST_TASKS_ENDPOINT);

          expect(response.status).to.be.equal(401);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai.request(app).get(LIST_TASKS_ENDPOINT);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Expired ou invalid token', async () => {
          const response = await chai.request(app).get(LIST_TASKS_ENDPOINT);

          expect(response.body.message).to.be.equal('Expired ou invalid token');
        });
      });

      describe('Request with invalid token', () => {
        before(() => {});

        it('should return status code 401', async () => {
          const response = await chai
            .request(app)
            .get(LIST_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken');

          expect(response.status).to.be.equal(401);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .get(LIST_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken');

          expect(response.body).to.have.property('message');
        });

        it('message should be: Expired ou invalid token', async () => {
          const response = await chai
            .request(app)
            .get(LIST_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken');

          expect(response.body.message).to.be.equal('Expired ou invalid token');
        });
      });
    });

    describe('Non-existent user', () => {
      before(() => {
        userRepositoryFindByIdStub.resolves(null);
      });

      it('should return status code 404', async () => {
        const response = await chai
          .request(app)
          .get(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.status).to.be.equal(404);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .get(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.body).to.have.property('message');
      });

      it('message should be: User does not exist', async () => {
        const response = await chai
          .request(app)
          .get(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.body.message).to.be.equal('User does not exist');
      });
    });

    describe('Error on database', () => {
      describe('Error while verify user existence', () => {
        before(() => {
          userRepositoryFindByIdStub.rejects();
        });

        it('should return status code 500', async () => {
          const response = await chai
            .request(app)
            .get(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.status).to.be.equal(500);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .get(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Unexpected error while checking user existence', async () => {
          const response = await chai
            .request(app)
            .get(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.body.message).to.be.equal(
            'Unexpected error while checking user existence'
          );
        });
      });
    });
  });
});
