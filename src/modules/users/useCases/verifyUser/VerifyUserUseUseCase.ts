import { IUsersRepository } from '../../repository/IUsersRepository';
import { ISuccess } from '../../../../@types/interfaces';

import { NotFoundError } from '../../../../utils/Errors';

class VerifyUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(id: string): Promise<ISuccess<null>> {
    const findedUser = await this.userRepository.findById(id);

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
