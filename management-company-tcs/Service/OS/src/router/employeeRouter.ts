import express from "express";
const router = express();
import * as EmployeeController from "../controllers/employee";

router.get("/", EmployeeController.get);
router.get("/:guid", EmployeeController.getOne);
router.get("/:guid/timeofflimit", EmployeeController.getTimeOffLimitInfo);
router.get("/account/:guid", EmployeeController.getByAccount);
router.post("/", EmployeeController.insert);
router.put("/:guid", EmployeeController.update);
router.delete("/:guid", EmployeeController.deleteMe);
router.post("/employeeByDepartment/:guid", EmployeeController.getAllEmployeeByDepartment);

export default router;
