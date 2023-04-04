import express from "express";
const router = express();
import * as SubDepartmentController from "../controllers/subDepartment";

router.get("/", SubDepartmentController.getSubDepartment);
router.post("/", SubDepartmentController.insert);
router.put("/:guid", SubDepartmentController.update);
router.delete("/:guid", SubDepartmentController.deleteSubDepartment);
router.get("/getSubByGuidParent/:guid", SubDepartmentController.getSubDepartmentByGuidDepartment);
router.get("/department/:code",SubDepartmentController.getSubDepartmentByDepartmentCode);

export default router;
