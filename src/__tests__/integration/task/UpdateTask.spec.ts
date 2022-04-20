import 'dotenv/config';

import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import Sinon from 'sinon';

import { UserRepository } from '../../../modules/users/repository/UsersRepository';
import { TasksRepository } from '../../../modules/tasks/repository/TasksRepository';

import { tasks, newTask } from '../../mocks/tasks';
import { app } from '../../../app';
import { TaskReturn } from '../../../@types/types';

chai.use(chaiHTTP);

const { id, title, description, status, userId, updatedAt } = newTask;

const UPDATE_TASKS_ENDPOINT = `/v1/api/tasks/${id}`;
const FAKE_TOKEN = process.env.TEST_TOKEN as string;

const TASK_RETURN: TaskReturn = {
  id,
  title,
  description,
  status,
  updatedAt,
};
const UPDATE_TASK = {
  title,
  description,
  status,
};

describe('Test PUT endpoint "/tasks/:id', () => {
  let userRepositoryFindByIdStub: Sinon.SinonStub;
  let taskRepositoryFindById: Sinon.SinonStub;
  let taskRepositoryUpdateStub: Sinon.SinonStub;

  before(() => {
    userRepositoryFindByIdStub = Sinon.stub(
      UserRepository.prototype,
      'findById'
    );
    taskRepositoryFindById = Sinon.stub(TasksRepository.prototype, 'findById');
    taskRepositoryUpdateStub = Sinon.stub(TasksRepository.prototype, 'update');
  });

  after(() => {
    userRepositoryFindByIdStub.restore();
    taskRepositoryFindById.restore();
    taskRepositoryUpdateStub.restore();
  });

  describe('Success case', () => {
    before(() => {
      userRepositoryFindByIdStub.resolves(userId);
      taskRepositoryFindById.resolves(tasks[0]);
      taskRepositoryUpdateStub.resolves(TASK_RETURN);
    });

    describe('Should return a success response with status and the updated task', () => {
      it('status code should be 200', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response).to.have.status(200);
      });

      it('the updated task should not contain "userId"', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body).to.not.have.property('userId');
      });

      it('should return the updated task', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body).to.deep.equal(TASK_RETURN);
      });
    });
  });

  describe('Error cases', () => {
    describe('Invalid body', () => {
      describe('Update task with invalid title', () => {
        describe('Title with less than 5 characters', () => {
          it('should return status code 400', async () => {
            const response = await chai
              .request(app)
              .put(UPDATE_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...UPDATE_TASK, title: 'test' });

            expect(response.status).to.be.equal(400);
          });

          it('should return a response with "message" property', async () => {
            const response = await chai
              .request(app)
              .put(UPDATE_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...UPDATE_TASK, title: 'test' });

            expect(response.body).to.have.property('message');
          });

          it('message should be: "title" length must be at least 5 characters long', async () => {
            const response = await chai
              .request(app)
              .put(UPDATE_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...UPDATE_TASK, title: 'test' });

            expect(response.body.message).to.be.equal(
              '"title" length must be at least 5 characters long'
            );
          });
        });

        describe('Title with more than 20 characters', () => {
          it('should return status code 400', async () => {
            const response = await chai
              .request(app)
              .put(UPDATE_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...UPDATE_TASK, title: 'test'.repeat(21) });

            expect(response.status).to.be.equal(400);
          });

          it('should return a response with "message" property', async () => {
            const response = await chai
              .request(app)
              .put(UPDATE_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...UPDATE_TASK, title: 'test'.repeat(21) });

            expect(response.body).to.have.property('message');
          });

          it('message should be: "title" length must be less than or equal to 20 characters long', async () => {
            const response = await chai
              .request(app)
              .put(UPDATE_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...UPDATE_TASK, title: 'test'.repeat(21) });

            expect(response.body.message).to.be.equal(
              '"title" length must be less than or equal to 20 characters long'
            );
          });
        });
      });

      describe('Update task withou title', () => {
        const taskWithoutTitle = { description, status };

        it('should return status code 400', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send(taskWithoutTitle);

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send(taskWithoutTitle);

          expect(response.body).to.have.property('message');
        });

        it('message should be: "title" is required', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send(taskWithoutTitle);

          expect(response.body.message).to.be.equal('"title" is required');
        });
      });

      describe('Create task with invalid description', () => {
        it('should return status code 400', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...UPDATE_TASK, description: 'test'.repeat(121) });

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...UPDATE_TASK, description: 'test'.repeat(121) });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "description" length must be less than or equal to 120 characters long', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...UPDATE_TASK, description: 'test'.repeat(121) });

          expect(response.body.message).to.be.equal(
            '"description" length must be less than or equal to 120 characters long'
          );
        });
      });

      describe('Update task with invalid status', () => {
        it('should return status code 400', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...UPDATE_TASK, status: 'test' });

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...UPDATE_TASK, status: 'test' });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "status" must be one of [TODO, IN_PROGRESS, DONE]', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...UPDATE_TASK, status: 'test' });

          expect(response.body.message).to.be.equal(
            '"status" must be one of [TODO, IN_PROGRESS, DONE]'
          );
        });
      });

      describe('Create task pass other fields other than title, description and status', () => {
        it('should return status code 400', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...UPDATE_TASK, otherField: 'test' });

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...UPDATE_TASK, otherField: 'test' });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "otherField" is not allowed', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...UPDATE_TASK, otherField: 'test' });

          expect(response.body.message).to.be.equal(
            '"otherField" is not allowed'
          );
        });
      });
    });

    describe('Invalid authorization', () => {
      describe('Request without token', () => {
        it('should return status code 401', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .send(UPDATE_TASK);

          expect(response.status).to.be.equal(401);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .send(UPDATE_TASK);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Expired or invalid token', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .send(UPDATE_TASK);

          expect(response.body.message).to.be.equal('Expired or invalid token');
        });
      });

      describe('Request with invalid token', () => {
        before(() => {});

        it('should return status code 401', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken')
            .send(UPDATE_TASK);

          expect(response.status).to.be.equal(401);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken')
            .send(UPDATE_TASK);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Expired or invalid token', async () => {
          const response = await chai
            .request(app)
            .put(UPDATE_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken')
            .send(UPDATE_TASK);

          expect(response.body.message).to.be.equal('Expired or invalid token');
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
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.status).to.be.equal(404);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body).to.have.property('message');
      });

      it('message should be: User does not exist', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

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
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.status).to.be.equal(404);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body).to.have.property('message');
      });

      it('message should be: Task not found', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body.message).to.be.equal('Task not found');
      });
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
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.status).to.be.equal(500);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body).to.have.property('message');
      });

      it('message should be: Internal server error', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body.message).to.be.equal(
          'Internal server error'
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
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.status).to.be.equal(500);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body).to.have.property('message');
      });

      it('message should be: Internal server error', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body.message).to.be.equal(
          'Internal server error'
        );
      });
    });

    describe('Error while update task', () => {
      before(() => {
        userRepositoryFindByIdStub.resolves(userId);
        taskRepositoryFindById.resolves(id);
        taskRepositoryUpdateStub.rejects();
      });

      it('should return status code 500', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.status).to.be.equal(500);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body).to.have.property('message');
      });

      it('message should be: Internal server error', async () => {
        const response = await chai
          .request(app)
          .put(UPDATE_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(UPDATE_TASK);

        expect(response.body.message).to.be.equal(
          'Internal server error'
        );
      });
    });
  });
});
