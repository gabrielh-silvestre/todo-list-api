import { StatusCodes } from 'http-status-codes';

import { ErrorStatusCode } from '../types';

export * from './services.interface';
export * from './users.interface';
export * from './tasks.interface';

interface IError {
  statusCode: ErrorStatusCode;
  message: string;
}

interface ISuccess<T> {
  statusCode: keyof typeof StatusCodes;
  data: T;
}

export {
  IError,
  ISuccess,
};
