import { NotFoundError } from 'restify-errors';
import { StatusCodes } from 'http-status-codes';

import { IUsersRepository } from '../../repository/IUsersRepository';
import { ISuccess, IUserIdentifier } from '../../../../@types/interfaces';

interface IRequest extends IUserIdentifier {}

class VerifyUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({ id }: IRequest): Promise<ISuccess<null> | never> {
    const foundUser = await this.userRepository.findById({ id });

    if (!foundUser) {
      throw new NotFoundError('User does not exist');
    }

    return {
      statusCode: StatusCodes.OK,
      data: null,
    };
  }
}

export { VerifyUserUseCase };
