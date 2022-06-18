import { Handler } from 'express';

interface IUserValidator {
  createValidation: Handler;
  loginValidation: Handler;
}

interface IBasicUserData {
  id: string;
  email: string;
  username: string;
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
