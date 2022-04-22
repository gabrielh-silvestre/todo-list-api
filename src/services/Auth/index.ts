import jwt from 'jsonwebtoken';

import { IAuthService } from '../../@types/interfaces';
import { TokenPayload } from '../../@types/types';
import { jwtConfig } from '../../config/jwtConfig';

class AuthService implements IAuthService<TokenPayload> {
  createToken(userId: string) {
    const { secret, expiresIn, algorithm } = jwtConfig;

    const token = `Bearer ${jwt.sign({ data: userId }, secret, {
      expiresIn,
      algorithm,
    })}`;

    return token;
  }

  verifyToken(token: string) {
    const { secret } = jwtConfig;

    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (err) {
      return null;
    }
  }
}

export { AuthService };
