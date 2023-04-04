import express from "express";
const router = express();
import * as ApplicantController from "../controllers/applicant";

router.get("/:guid", ApplicantController.getOne);
router.put("/:guid", ApplicantController.update);
router.get("/employee/:guid", ApplicantController.getByEmployee);
router.get("/", ApplicantController.getAll);
router.post("/", ApplicantController.insert);
router.delete("/:guid", ApplicantController.deleteCompany);
export default router;
