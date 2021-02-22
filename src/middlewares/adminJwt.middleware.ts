import * as Interfaces from '@interfaces';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { MIDDLEWARE_RESPONSE } from '../constant/response';
import * as Helpers from '../helpers';
declare module 'express' {
  interface Request {
    userInfo: any;
  }
}
const setResponse = Helpers.ResponseHelper;

function adminValidateToken(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const redisUserTokenDb: string = process.env.redisUserTokenDb;

  const token =
    request.body.accessToken ||
    request.query.accessToken ||
    request.headers['api-access-token'];
  // console.log(token);
  jwt.verify(token, process.env.JWTSECRET, async (err: any, decoded: any) => {
    if (err) {
      return setResponse.error(response, {message:err.message});
    }
    try {
      const exist = await Helpers.RedisHelper.getString(
        'jwt_token_' + decoded.adminId,
        redisUserTokenDb,
      );
      const accessRole = decoded.accessRole;
      console.log('accessRole', accessRole);
      if (accessRole != 0 && accessRole != 1 && accessRole != 2) {
        return setResponse.error(response, {message:MIDDLEWARE_RESPONSE.PERMISSION_DENIED});
      }
      if (exist != null) {
        request.userInfo = decoded;
        next();
      } else {
        return setResponse.error(response, {message:MIDDLEWARE_RESPONSE.JWTERROR});
      }
    } catch (error) {
      return setResponse.error(response, {message:MIDDLEWARE_RESPONSE.JWTERROR});

    }
  });
}

export default adminValidateToken;
