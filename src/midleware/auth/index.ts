import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { jwtConfig } from '../../config/jwtConfig';

type TokenPayload = {
  data: string;
};

interface IAuth<T> {
  createToken(id: string): string;
  verifyToken(token: string): T | null;
  encriptPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
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

  async encriptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}

export { Auth, IAuth, TokenPayload };
