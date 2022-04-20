import { User } from '@prisma/client';

import { IUsersRepository } from '../../repository/IUsersRepository';
import { ISuccess } from '../../../../@types/interfaces';

import { InternalError, NotFoundError } from '../../../../utils/Errors';

class VerifyUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(id: string): Promise<ISuccess<null>> {
    let findedUser: User | null = null;

    try {
      findedUser = await this.userRepository.findById(id);
    } catch (err) {
      throw new InternalError(
        'Unexpected error while checking user existence',
        err
      );
    }

    if (!findedUser) {
      throw new NotFoundError('User does not exist');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { VerifyUserUseCase };
