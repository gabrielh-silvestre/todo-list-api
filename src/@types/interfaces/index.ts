import { StatusCodes } from 'http-status-codes';

export * from './services.interface';
export * from './users.interface';
export * from './tasks.interface';

type StatusCodesKeys = keyof typeof StatusCodes;

interface IError {
  statusCode: StatusCodesKeys;
  message: string;
}

interface ISuccess<T> {
  statusCode: number;
  data: T;
}

export { IError, ISuccess };
