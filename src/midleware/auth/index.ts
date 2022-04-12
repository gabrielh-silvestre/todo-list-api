import { NextFunction, Request, Response } from 'express';

import { IAuthService } from '../../@types/interfaces';
import { TokenPayload } from '../../@types/types';

import { AuthService } from '../../services/Auth';
import { errorStatusCode } from '../../utils/errorsCode';

class AuthMiddleware {
  constructor(private authService: IAuthService<TokenPayload>) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    const isValid = this.authService.verifyToken(authorization as string);

    if (!isValid) {
      return res.status(errorStatusCode.UNAUTHORIZED).json({
        message: 'Expired ou invalid token',
      });
    }

    req.body = {
      ...req.body,
      userId: isValid.data,
    };
    next();
  }
}

const authService = new AuthService();
export const authMiddleware = new AuthMiddleware(authService);
