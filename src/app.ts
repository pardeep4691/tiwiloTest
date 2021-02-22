import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as ejs from "ejs";
import * as express from "express";
import * as fileUpload from "express-fileupload";
import * as fs from "fs";
import * as path from "path";
import * as config from "../src/config/";
import * as Helper from "./helpers/index";
import { Controller } from "./interfaces";
import { errorMiddleware } from "./middlewares";
// import { passportMiddleware } from './middlewares/'; make
const mailHelper = Helper.MailHelper;
class App {
  public app: express.Application;
  constructor(controllers: Controller[]) {
    // config.initiate();
    this.app = express();
    this.uploadSettings();
    this.getProcessInfo();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.getUpload();
  }

  public listen() {
    this.app.listen(process.env.PORT ? process.env.PORT : 8082, () => {
      console.log(
        `App listening on the port ${
          process.env.PORT ? process.env.PORT : 8082
        }`
      );
      // console.log('Process ' + process.pid + ' is listening to all incoming requests');
    });
  }
  public getServer() {
    return this.app;
  }
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "ejs");
    this.app.use(cors());
  }
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use("/users", controller.router);
    });
    this.app.get("/users/status", (req, res) => {
      console.log("Status Route called");
      return res.json({ status: "success" });
    });
  }
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private getProcessInfo() {
    this.app.use((req, res, next) => {
      mailHelper.appObject = res;
      // console.log(`Process ID ${process.pid} has request`);
      next();
    });
  }

  private uploadSettings() {
    this.app.use(fileUpload());
  }

  private getUpload() {
    this.app.use("/users/uploads/:name", (req, res, next) => {
      const filePath = req.params.name;
      fs.readFile("./uploads/" + filePath, (err, data) => {
        if (err) {
          console.log(err);
          return res.send("file not found");
        }
        return res.sendFile("/uploads/" + filePath, { root: "." });
      });
    });
  }
}
export default App;
