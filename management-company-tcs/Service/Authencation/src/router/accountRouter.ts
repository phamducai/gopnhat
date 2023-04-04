import express from "express";
const router = express();
import * as AccountController from "../controllers/account";

router.post("/account", AccountController.insert);
router.get("/:guid", AccountController.getAll);
router.put("/updateaccount/:guid", AccountController.update);
router.delete("/deleteaccount/:guid", AccountController.deletes);
router.put("/updatePassword", AccountController.updatePassword);

export default router;
