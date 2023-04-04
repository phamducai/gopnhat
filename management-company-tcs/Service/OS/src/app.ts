import express from "express";
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
// Create Express server
const app = express();

import CompanyRouter from "./router/companyRouter";
import DepartmentRouter from "./router/departmentRouter";
import SubDepartmentRouter from "./router/subDepartmentRouter";
import EmployeeRouter from "./router/employeeRouter";
import ApplicantRouter from "./router/applicantRouter";
import TimeOffItemRouter from "./router/timeOffItemRouter";
import TimeOffTypeRouter from "./router/timeOffTypeRouter";
import TimeOffLimitRouter from "./router/timeOffLimitRouter";
import ImagesRouter from "./router/imagesRouter";

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}
app.options("*", cors());
app.use(cors());

//Router import
app.use("/api/company", CompanyRouter);
app.use("/api/department", DepartmentRouter);
app.use("/api/subdepartment", SubDepartmentRouter);
app.use("/api/employee", EmployeeRouter);
app.use("/api/applicant", ApplicantRouter);
app.use("/api/timeoffitem", TimeOffItemRouter);
app.use("/api/timeofftype", TimeOffTypeRouter);
app.use("/api/timeofflimit", TimeOffLimitRouter);
app.use("/api/images", ImagesRouter);
app.use("/api/download", express.static("./uploads"));
// starting the server
app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});

export default app;
