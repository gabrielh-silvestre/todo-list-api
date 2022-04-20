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

const LIST_TASKS_ENDPOINT = '/v1/api/tasks';
const FAKE_TOKEN = process.env.TEST_TOKEN as string;

const { id, title, description, status, userId, updatedAt } = newTask;
const TASK_RETURN: TaskReturn = {
  id,
  title,
  description,
  status,
  updatedAt,
};
const CREATE_NEW_TASK = {
  title,
  description,
};

describe('Test POST endpoint "/tasks"', () => {
  let userRepositoryFindByIdStub: Sinon.SinonStub;
  let taskRepositoryFindByTitle: Sinon.SinonStub;
  let taskRepositoryCreateStub: Sinon.SinonStub;

  before(() => {
    userRepositoryFindByIdStub = Sinon.stub(
      UserRepository.prototype,
      'findById'
    );
    taskRepositoryFindByTitle = Sinon.stub(
      TasksRepository.prototype,
      'findByExactTitle'
    );
    taskRepositoryCreateStub = Sinon.stub(TasksRepository.prototype, 'create');
  });

  after(() => {
    userRepositoryFindByIdStub.restore();
    taskRepositoryFindByTitle.restore();
    taskRepositoryCreateStub.restore();
  });

  describe('Success case', () => {
    before(() => {
      userRepositoryFindByIdStub.resolves(userId);
      taskRepositoryFindByTitle.resolves([]);
      taskRepositoryCreateStub.resolves(TASK_RETURN);
    });

    describe('Should return  a success status with the new task', () => {
      it('status code should be 201', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(CREATE_NEW_TASK);

        expect(response.status).to.be.equal(201);
      });

      it('the new task should not contain "userId"', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(CREATE_NEW_TASK);

        expect(response.body).to.not.have.property('userId');
      });

      it('should return the new task', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(CREATE_NEW_TASK);

        expect(response.body).to.be.deep.equal(TASK_RETURN);
      });
    });
  });

  describe('Error cases', () => {
    describe('Invalid authorization', () => {
      describe('Request without token', () => {
        it('should return status code 401', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .send(CREATE_NEW_TASK);

          expect(response.status).to.be.equal(401);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .send(CREATE_NEW_TASK);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Expired or invalid token', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .send(CREATE_NEW_TASK);

          expect(response.body.message).to.be.equal('Expired or invalid token');
        });
      });

      describe('Request with invalid token', () => {
        before(() => {});

        it('should return status code 401', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken')
            .send(CREATE_NEW_TASK);

          expect(response.status).to.be.equal(401);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken')
            .send(CREATE_NEW_TASK);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Expired or invalid token', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', 'invalidToken')
            .send(CREATE_NEW_TASK);

          expect(response.body.message).to.be.equal('Expired or invalid token');
        });
      });
    });

    describe('Invalid body', () => {
      describe('Create task with invalid title', () => {
        describe('Title with less than 5 characters', () => {
          it('should return status code 400', async () => {
            const response = await chai
              .request(app)
              .post(LIST_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...CREATE_NEW_TASK, title: 'test' });

            expect(response.status).to.be.equal(400);
          });

          it('should return a response with "message" property', async () => {
            const response = await chai
              .request(app)
              .post(LIST_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...CREATE_NEW_TASK, title: 'test' });

            expect(response.body).to.have.property('message');
          });

          it('message should be: "title" length must be at least 5 characters long', async () => {
            const response = await chai
              .request(app)
              .post(LIST_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...CREATE_NEW_TASK, title: 'test' });

            expect(response.body.message).to.be.equal(
              '"title" length must be at least 5 characters long'
            );
          });
        });

        describe('Title with more than 20 characters', () => {
          it('should return status code 400', async () => {
            const response = await chai
              .request(app)
              .post(LIST_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...CREATE_NEW_TASK, title: 'test'.repeat(21) });

            expect(response.status).to.be.equal(400);
          });

          it('should return a response with "message" property', async () => {
            const response = await chai
              .request(app)
              .post(LIST_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...CREATE_NEW_TASK, title: 'test'.repeat(21) });

            expect(response.body).to.have.property('message');
          });

          it('message should be: "title" length must be less than or equal to 20 characters long', async () => {
            const response = await chai
              .request(app)
              .post(LIST_TASKS_ENDPOINT)
              .set('Authorization', FAKE_TOKEN)
              .send({ ...CREATE_NEW_TASK, title: 'test'.repeat(21) });

            expect(response.body.message).to.be.equal(
              '"title" length must be less than or equal to 20 characters long'
            );
          });
        });
      });

      describe('Create task without title', () => {
        const taskWithoutTitle = { description };

        it('should return status code 400', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send(taskWithoutTitle);

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send(taskWithoutTitle);

          expect(response.body).to.have.property('message');
        });

        it('message should be: "title" is required', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send(taskWithoutTitle);

          expect(response.body.message).to.be.equal('"title" is required');
        });
      });

      describe('Create task with invalid description', () => {
        it('should return status code 400', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...CREATE_NEW_TASK, description: 'test'.repeat(121) });

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...CREATE_NEW_TASK, description: 'test'.repeat(121) });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "description" length must be less than or equal to 120 characters long', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...CREATE_NEW_TASK, description: 'test'.repeat(121) });

          expect(response.body.message).to.be.equal(
            '"description" length must be less than or equal to 120 characters long'
          );
        });
      });

      describe('Create task pass other fields other than title and description', () => {
        it('should return status code 400', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...CREATE_NEW_TASK, otherField: 'test' });

          expect(response.status).to.be.equal(400);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...CREATE_NEW_TASK, otherField: 'test' });

          expect(response.body).to.have.property('message');
        });

        it('message should be: "otherField" is not allowed', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send({ ...CREATE_NEW_TASK, otherField: 'test' });

          expect(response.body.message).to.be.equal(
            '"otherField" is not allowed'
          );
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
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(CREATE_NEW_TASK);

        expect(response.status).to.be.equal(404);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(CREATE_NEW_TASK);

        expect(response.body).to.have.property('message');
      });

      it('message should be: User does not exist', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(CREATE_NEW_TASK);

        expect(response.body.message).to.be.equal('User does not exist');
      });
    });

    describe('Task already exists', () => {
      before(() => {
        userRepositoryFindByIdStub.resolves(userId);
        taskRepositoryFindByTitle.resolves([tasks[0]]);
      });

      it('should return status code 409', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(CREATE_NEW_TASK);

        expect(response.status).to.be.equal(409);
      });

      it('should return a response with "message" property', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(CREATE_NEW_TASK);

        expect(response.body).to.have.property('message');
      });

      it('message should be: Task with this title already exists', async () => {
        const response = await chai
          .request(app)
          .post(LIST_TASKS_ENDPOINT)
          .set('Authorization', FAKE_TOKEN)
          .send(CREATE_NEW_TASK);

        expect(response.body.message).to.be.equal(
          'Task with this title already exists'
        );
      });
    });

    describe('Error on database', () => {
      describe('Error while checking task uniqueness', () => {
        before(() => {
          taskRepositoryFindByTitle.rejects();
        });

        it('should return status code 500', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send(CREATE_NEW_TASK);

          expect(response.status).to.be.equal(500);
        });

        it('should return a response with "message" property', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send(CREATE_NEW_TASK);

          expect(response.body).to.have.property('message');
        });

        it('message should be: Unexpected error while checking task uniqueness', async () => {
          const response = await chai
            .request(app)
            .post(LIST_TASKS_ENDPOINT)
            .set('Authorization', FAKE_TOKEN)
            .send(CREATE_NEW_TASK);

          expect(response.body.message).to.be.equal(
            'Unexpected error while checking task uniqueness'
          );
        });
      });
    });
  });
});
