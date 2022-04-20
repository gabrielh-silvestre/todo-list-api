import { User } from '@prisma/client';

import { IUsersRepository } from '../../repository/IUsersRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode } from '../../../../@types/types';

import { CustomError } from '../../../../utils/CustomError';

class VerifyUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(id: string): Promise<ISuccess<null>> {
    let findedUser: User | null = null;

    try {
      findedUser = await this.userRepository.findById(id);
    } catch (err) {
      throw new CustomError(
        ErrorStatusCode.INTERNAL_SERVER_ERROR,
        'Unexpected error while checking user existence'
      );
    }

    if (!findedUser) {
      throw new CustomError(ErrorStatusCode.NOT_FOUND, 'User does not exist');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { VerifyUserUseCase };
