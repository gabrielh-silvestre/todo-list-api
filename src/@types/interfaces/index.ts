import { ErrorStatusCode, SuccessStatusCode } from '../types';

export * from './services.interface';
export * from './users.interface';
export * from './tasks.interface';

interface IError {
  statusCode: ErrorStatusCode;
  message: string;
}

interface ISuccess<T> {
  statusCode: SuccessStatusCode;
  data: T;
}

export {
  IError,
  ISuccess,
};
