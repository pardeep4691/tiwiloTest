import * as express from "express";
import * as jwt from "jsonwebtoken";
import { MIDDLEWARE_RESPONSE } from "../constant/response";
import * as Helpers from "../helpers";
declare module "express" {
  interface Request {
    userInfo: any;
  }
}
const setResponse = Helpers.ResponseHelper;

function validateToken(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  const redisUserTokenDb = process.env.redisUserTokenDb;

  const token =
    request.body.accessToken ||
    request.query.accessToken ||
    request.headers["api-access-token"];
  console.log(token);
  jwt.verify(token, process.env.JWTSECRET, async (err: any, decoded: any) => {
    if (err) {
      return setResponse.error(response, { message: err.message });
    }
    try {
      console.log("decoded", decoded);
      const exist = await Helpers.RedisHelper.getString(
        "jwt_token_" + decoded.jwtData,
        redisUserTokenDb
      );
      console.log("exist", exist);
      // check if token exist or not
      if (exist != null) {
        request.userInfo = decoded;
        next();
      } else {
        return setResponse.error(response, {
          message: MIDDLEWARE_RESPONSE.JWTERROR,
        });
      }
    } catch (error) {
      return setResponse.error(response, {
        message: MIDDLEWARE_RESPONSE.JWTERROR,
      });
    }
  });
}

export default validateToken;
