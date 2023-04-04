import express from "express";
const router = express();
import * as TimeOffLimitController from "../controllers/timeOffLimit";

router.get("/", TimeOffLimitController.get);
router.post("/", TimeOffLimitController.insert);
router.put("/:guid", TimeOffLimitController.update);
router.delete("/:guid", TimeOffLimitController.deleteMe);
router.post("/limit/:employeeGuid", TimeOffLimitController.updateTimeOffLimit);
export default router;
