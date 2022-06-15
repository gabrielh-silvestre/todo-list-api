import { expect } from 'chai';
import Sinon from 'sinon';

import { UserRepository } from '../../../../src/modules/users/repository/UsersRepository';
import { verifyUserUseCase } from '../../../../src/modules/users/useCases/verifyUser';

import { users } from '../../../mocks/users';

const [{ id }, user] = users;

describe('Test VerifyUserUseCase', () => {
  let findByIdStub: Sinon.SinonStub;

  describe('Success case', () => {
    before(() => {
      findByIdStub = Sinon.stub(UserRepository.prototype, 'findById');
      findByIdStub.resolves(user);
    });

    after(() => {
      findByIdStub.restore();
    });

    it('should return a object with an status code and data', async () => {
      const response = await verifyUserUseCase.execute({ id });

      expect(response).to.be.an('object');
      expect(response).to.have.property('statusCode');
      expect(response).to.have.property('data');

      expect(response.statusCode).to.be.equal(200);
      expect(response.data).to.be.null;
    });
  });

  describe('Error case', () => {
    before(() => {
      findByIdStub = Sinon.stub(UserRepository.prototype, 'findById');
      findByIdStub.resolves(null);
    });

    after(() => {
      findByIdStub.restore();
    });

    it('should throw an error with status code and message', async () => {
      try {
        await verifyUserUseCase.execute({ id });
        expect.fail('Should throw an error');
      } catch (err) {
        expect(err).to.have.property('statusCode');
        expect(err).to.have.property('message');

        expect(err.statusCode).to.be.equal(404);
        expect(err.message).to.be.equal('User does not exist');
      }
    });
  });
});
