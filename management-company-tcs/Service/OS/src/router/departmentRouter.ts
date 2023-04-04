import express from "express";
const router = express();
import * as DepartmentController from "../controllers/department";

router.get("/:companyId", DepartmentController.getDepartment);
router.get("/code/:code", DepartmentController.getDepartmentByCode);
router.post("/", DepartmentController.insert);
router.put("/:guid", DepartmentController.update);
router.delete("/:guid", DepartmentController.deleteDepartment);

export default router;
