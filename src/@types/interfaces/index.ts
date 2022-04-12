import { Handler } from 'express';

import { ErrorStatusCode, SuccessStatusCode } from '../types';

interface IUserValidation {
  createValidation: Handler;
  loginValidation: Handler;
  athenticationValidation: Handler;
}

interface IAuthService<T> {
  createToken(id: string): string;
  verifyToken(token: string): T | null;
}

interface IEncriptService {
  encript(value: string): Promise<string>;
  verify(value: string, hash: string): Promise<boolean>;
}

interface IError {
  statusCode: ErrorStatusCode;
  message: string;
}

interface ISuccess<T> {
  statusCode: SuccessStatusCode;
  data: T;
}

export { IUserValidation, IAuthService, IEncriptService, IError, ISuccess };
