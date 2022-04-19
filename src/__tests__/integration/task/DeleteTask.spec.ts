import 'dotenv/config';

import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import Sinon from 'sinon';

import { UserRepository } from '../../../modules/users/repository/UsersRepository';
import { TasksRepository } from '../../../modules/tasks/repository/TasksRepository';

import { tasks } from '../../mocks/tasks';
import { app } from '../../../app';

chai.use(chaiHTTP);

const [{ id, userId }] = tasks;

const DELETE_TASKS_ENDPOINT = `/v1/api/tasks/${id}`;
const FAKE_TOKEN = process.env.TEST_TOKEN as string;

describe('Test DELETE endpoint "/tasks/:id"', () => {
  let userRepositoryFindByIdStub: Sinon.SinonStub;
  let taskRepositoryFindById: Sinon.SinonStub;
  let taskRepositoryDelete: Sinon.SinonStub;

  before(() => {
    userRepositoryFindByIdStub = Sinon.stub(
      UserRepository.prototype,
      'findById'
    );
    taskRepositoryFindById = Sinon.stub(TasksRepository.prototype, 'findById');
    taskRepositoryDelete = Sinon.stub(TasksRepository.prototype, 'delete');
  });

  after(() => {
    userRepositoryFindByIdStub.restore();
    taskRepositoryFindById.restore();
    taskRepositoryDelete.restore();
  });

  describe('Success case', () => {
    before(() => {
      userRepositoryFindByIdStub.resolves(userId);
      taskRepositoryFindById.resolves(tasks[0]);
      taskRepositoryDelete.resolves();
    });

    describe('Should return a success response with status', () => {
      it('status code should be 204', async () => {
        const response = await chai
          .request(app)
          .delete(DELETE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.status).to.equal(204);
      });

      it('request body should be empty', async () => {
        const response = await chai
          .request(app)
          .delete(DELETE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.body).to.be.empty;
      });
    });
  });

  describe('Error cases', () => {
    describe('Invalid authorization', () => {
      describe('Request without token', () => {
        it('should return status code 401', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT);

          expect(response.status).to.be.equal(401);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Expired ou invalid token', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT);

          expect(response.body.message).to.be.equal('Expired ou invalid token');
        });
      });

      describe('Request with invalid token', () => {
        before(() => {});

        it('should return status code 401', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken');

          expect(response.status).to.be.equal(401);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken');

          expect(response.body).to.have.property('message');
        });

        it('message should be: Expired ou invalid token', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
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
          .delete(DELETE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.status).to.be.equal(404);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .delete(DELETE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.body).to.have.property('message');
      });

      it('message should be: User does not exist', async () => {
        const response = await chai
          .request(app)
          .delete(DELETE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.body.message).to.be.equal('User does not exist');
      });
    });

    describe('Non-existent task', () => {
      before(() => {
        userRepositoryFindByIdStub.resolves(userId);
        taskRepositoryFindById.resolves(null);
      });

      it('should return status code 404', async () => {
        const response = await chai
          .request(app)
          .delete(DELETE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.status).to.be.equal(404);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .delete(DELETE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.body).to.have.property('message');
      });

      it('message should be: Task not found', async () => {
        const response = await chai
          .request(app)
          .delete(DELETE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN);

        expect(response.body.message).to.be.equal('Task not found');
      });
    });

    describe('Database errors', () => {
      describe('Error while verify user existence', () => {
        before(() => {
          userRepositoryFindByIdStub.rejects();
        });

        it('should return status code 500', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.status).to.be.equal(500);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Unexpected error while checking user existence', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.body.message).to.be.equal(
            'Unexpected error while checking user existence'
          );
        });
      });

      describe('Error while verify task existence', () => {
        before(() => {
          userRepositoryFindByIdStub.resolves(userId);
          taskRepositoryFindById.rejects();
        });

        it('should return status code 500', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.status).to.be.equal(500);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Unexpected error while checking if task exist', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.body.message).to.be.equal(
            'Unexpected error while checking if task exist'
          );
        });
      });

      describe('Error while delete task', () => {
        before(() => {
          userRepositoryFindByIdStub.resolves(userId);
          taskRepositoryFindById.resolves(id);
          taskRepositoryDelete.rejects();
        });

        it('should return status code 500', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.status).to.be.equal(500);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Unexpected error while deleting task', async () => {
          const response = await chai
            .request(app)
            .delete(DELETE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN);

          expect(response.body.message).to.be.equal(
            'Unexpected error while deleting task'
          );
        });
      });
    });
  });
});
