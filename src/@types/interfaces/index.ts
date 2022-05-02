import { Handler } from 'express';

import { ErrorStatusCode, SuccessStatusCode } from '../types';

interface IUserValidator {
  createValidation: Handler;
  loginValidation: Handler;
}

interface ITaskValidator {
  createValidation: Handler;
}

interface IAuthService<T> {
  createToken(id: string): string;
  verifyToken(token: string): T | null;
}

interface IEncryptService {
  encrypt(value: string): Promise<string>;
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

export {
  IUserValidator,
  ITaskValidator,
  IAuthService,
  IEncryptService,
  IError,
  ISuccess,
};
