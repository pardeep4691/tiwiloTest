import * as Interfaces from "@interfaces";
import * as UserInterface from "./user.interface";
import * as express from "express";
import { RES_MSG } from "../../constant/response";
import * as Helpers from "../../helpers";
import * as Middlewares from "../../middlewares/";
import { body, param } from "express-validator";
import model from "./user.model";

const setResponse = Helpers.ResponseHelper;
const utilities = Helpers.Utilities;
const mailHelper = Helpers.MailHelper;
const userHelper = Helpers.UserHelper.default;
const RedisHelper = Helpers.RedisHelper;
const RabbitMq = Helpers.RabbitMq;
const TwilioHelper = Helpers.TwilioHelper;

class UserController implements Interfaces.Controller {
  public path = "";
  public router = express.Router();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .all(`${this.path}/*`)
      .get(this.path+"/check-area-code/:code",this.getAreaCode);
  }

  private getAreaCode = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const {code} = request.params;
      const checkCode = await Helpers.TwilioHelper.checkAreaCode(code);     
      return setResponse.success(response, {
        data: checkCode
      });
    } catch (err) {
      await model.rollbackTransaction();
      return setResponse.error(response, {
        message: err,
      });
    }
  };
} // End of User Class
export default UserController;
