var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
import express from "express";
import router from "./routes/AllRoutes";

import timeout from "connect-timeout";

import * as dotenv from "dotenv";
import { reAssignOwner, AssignDelegatedUser } from "./cron/runTimeStatus";

const app = express();
dotenv.config();
const cors = require("cors");
app.use(timeout("100000s", { respond: false }));
app.use(cors());
global.__basedir = __dirname;

var cron = require("node-cron");
app.use(function (err, req, res, next) {
  console.log(err.message);
  res.status(500).send({ message: "Something went wrong!" });
});

var reAssign = cron.schedule("2 0 * * *", () => {
  reAssignOwner();
  reAssign.stop();
  reAssign.start();
});
var AssignDelegated = cron.schedule("5 0 * * *", () => {
  AssignDelegatedUser();
  AssignDelegated.stop();
  AssignDelegated.start();
});
// const fileUpload = require("express-fileupload");
// // middleware
// app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// routers

app.use("/", router);

const port = process.env.PORT || 4444;

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

// function cors(): any {
//     throw new Error("Function not implemented.");
// }
