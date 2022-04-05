import { NextFunction, Request, Response } from 'express';

import {
  haveFormat,
  haveLetters,
  haveNumbers,
  isBetweenMaxAndMinLength,
  isDefinied,
} from '../../helpers/genericValidations';

const EMAIL_REGEX = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const validEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!isDefinied(email)) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!haveFormat(EMAIL_REGEX, email)) {
    return res.status(400).json({ message: 'Email is invalid' });
  }

  next();
};

const validUsername = (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body;

  if (!isDefinied(username)) {
    return res.status(400).json({ message: 'Username is required' });
  }

  if (!isBetweenMaxAndMinLength(10, 3, username)) {
    return res.status(400).json({ message: 'Username is invalid' });
  }

  next();
};

const validPassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!isDefinied(password)) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (!isBetweenMaxAndMinLength(16, 6, password)) {
    return res.status(400).json({ message: 'Password is invalid' });
  }

  if (!haveLetters(password) || !haveNumbers(password)) {
    return res.status(400).json({ message: 'Password is invalid' });
  }

  next();
};

export { validEmail, validUsername, validPassword };
