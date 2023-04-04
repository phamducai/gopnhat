import express from "express";
const router = express();
import * as CompanyController from "../controllers/company";

router.get("/", CompanyController.getComany);
router.post("/", CompanyController.insert);
router.put("/:guid", CompanyController.update);
router.delete("/:guid", CompanyController.deleteCompany);
export default router;
