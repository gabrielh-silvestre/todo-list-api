import { IUsersRepository } from '../../repository/IUsersRepository';
import { ISuccess, IUserIdentifier } from '../../../../@types/interfaces';

import { NotFoundError } from 'restify-errors';

interface IRequest extends IUserIdentifier {}

class VerifyUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({ id }: IRequest): Promise<ISuccess<null>> {
    const foundUser = await this.userRepository.findById({ id });

    if (!foundUser) {
      throw new NotFoundError('User does not exist');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { VerifyUserUseCase };
