import express from "express";
const router = express();
import * as TimeOffTypeController from "../controllers/timeOffType";

router.get("/", TimeOffTypeController.getOne);
router.post("/", TimeOffTypeController.insert);
router.put("/:guid", TimeOffTypeController.update);
router.delete("/:guid", TimeOffTypeController.deleteMe);
export default router;
