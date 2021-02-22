import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthenticationTokenMissingException, WrongAuthenticationTokenException } from '../exceptions/';
import { jwtTokenData } from '../interfaces/';

async function authMiddleware(request: express.Request, response: Response, next: express.NextFunction) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as jwtTokenData;
      const id = verificationResponse._id;
      next();
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
