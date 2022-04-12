import jwt from 'jsonwebtoken';

import { jwtConfig } from '../../config/jwtConfig';

type TokenPayload = {
  data: string;
};

interface IAuth<T> {
  createToken(id: string): string;
  verifyToken(token: string): T | null;
}

class Auth implements IAuth<TokenPayload> {
  createToken(userId: string) {
    const { secret, expiresIn, algorithm } = jwtConfig;

    const token = jwt.sign({ data: userId }, secret, {
      expiresIn: expiresIn,
      algorithm: algorithm,
    });

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

export { Auth, IAuth, TokenPayload };
