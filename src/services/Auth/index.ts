import jwt from 'jsonwebtoken';

import { TokenPayload } from '../../@types/types';
import { jwtConfig } from '../../config/jwtConfig';

class AuthService {
  public static createToken(userId: string) {
    const { secret, expiresIn, algorithm } = jwtConfig;

    const token = `Bearer ${jwt.sign({ data: userId }, secret, {
      expiresIn,
      algorithm,
    })}`;

    return token;
  }

  public static verifyToken(token: string) {
    const { secret } = jwtConfig;

    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (err) {
      return null;
    }
  }
}

export { AuthService };
