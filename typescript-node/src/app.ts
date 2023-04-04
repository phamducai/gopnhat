import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
// Create Express server
const app = express();
import * as productRouter from "./router/product";
// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Router import
app.use("/api/:id", productRouter.getRouterProduct);
app.use("/api", productRouter.getRouterProductAll);

// starting the server
// const server = app.listen(app.get("port"), () => {
//     console.log(`server on port ${app.get("port")}`);
// });

export default app;
