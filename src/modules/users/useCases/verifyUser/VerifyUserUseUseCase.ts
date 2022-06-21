import { NotFoundError } from 'restify-errors';
import { StatusCodes } from 'http-status-codes';

import type { IUsersRepository } from '../../../../@types/interfaces';
import type { SuccessCase, UserAttributes } from '../../../../@types/types';

class VerifyUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    id,
  }: Pick<UserAttributes, 'id'>): Promise<SuccessCase<null> | never> {
    const foundUser = await this.userRepository.findById(id);

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
