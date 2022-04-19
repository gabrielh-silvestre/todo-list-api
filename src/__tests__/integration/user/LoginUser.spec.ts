import { v4 as uuidV4 } from 'uuid';

import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import Sinon from 'sinon';

import { UserRepository } from '../../../modules/users/repository/UsersRepository';

import { users, newUser } from '../../mocks/users';
import { app } from '../../../app';
import { EncriptService } from '../../../services/Encript';

chai.use(chaiHTTP);

const LOGIN_USERS_ENDPOINT = '/v1/api/users/login';

describe.only('Test POST endpoint "/users/login"', () => {
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
});
