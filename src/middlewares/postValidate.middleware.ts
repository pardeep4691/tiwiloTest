import * as express from "express";
import { validationResult } from "express-validator";
import { RESPONSES } from "../constant/response";
/**
 * Throw error if failed to validate
 * @param req 
 * @param res 
 * @param next 
 */
const postValidate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(RESPONSES.BADREQUEST).send({
      message: { error: error.array() },
    });
  } else {
    next();
  }
};

export default postValidate;
