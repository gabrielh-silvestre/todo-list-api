import bcrypt from 'bcrypt';

import { User } from '../../model/User';
import { UserRepository } from '../../repository/UsersRepository';

interface IRequest {
  email: string;
  username: string;
  password: string;
}

class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, username, password }: IRequest): Promise<User> {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      email,
      username,
      password: encryptedPassword,
    });

    return newUser;
  }
}

export { CreateUserUseCase };
