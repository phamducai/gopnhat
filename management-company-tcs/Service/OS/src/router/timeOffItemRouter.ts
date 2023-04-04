import express from "express";
const router = express();
import * as TimeOffItemController from "../controllers/timeOffItem";

router.get("/", TimeOffItemController.getAll);
router.put("/", TimeOffItemController.updateByApplicant);
router.post("/", TimeOffItemController.insert);
router.get("/:guid", TimeOffItemController.getOneByApplicantGuid);
router.get("/getOne/:guid", TimeOffItemController.getOne);
router.get("/employee/:guid", TimeOffItemController.getByEmployee);
router.delete("/:guid", TimeOffItemController.deleteMe);
export default router;
