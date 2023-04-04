import express from "express";
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";

//Router
import AccountRouter from "./router/accountRouter";
import AuthRouter from "./router/authRouter";

//Rabbit
import { consumeRegisterAccount } from "./rabbit/consume/create-account";
import { consumeVerifyToken } from "./rabbit/consume/verify-token";

// Create Express server
const app = express();


// Express configuration
app.use(logger("dev"));

app.set("port", process.env.PORT || 3001);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Router import
app.use("/auth", AccountRouter);

app.use("/auth", AuthRouter);

// //Rabbit MQ Consumer
// consumeRegisterAccount("create-account");
// consumeVerifyToken("verify-token");
// starting the server
app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});

export default app;
