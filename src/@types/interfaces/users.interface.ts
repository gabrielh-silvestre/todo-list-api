import { Handler } from 'express';

interface IUserValidator {
  createValidation: Handler;
  loginValidation: Handler;
}

interface IBasicUserData {
  email: string;
  username: string;
  password: string;
}

interface IUserIdentifier {
  id: string;
}

interface IUserIdentifierByEmail {
  email: string;
}

export type {
  IUserValidator,
  IBasicUserData,
  IUserIdentifier,
  IUserIdentifierByEmail,
};
