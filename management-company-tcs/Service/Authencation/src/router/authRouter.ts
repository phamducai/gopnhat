import express from "express";
// import { verifyToken } from "../middleware/auth";
import * as AuthController from "../controllers/auth";
const router = express();
router.post("/login", AuthController.login);
router.post("/refreshToken", AuthController.accessToken);
// router.post("/verifyToken", AuthController.verifyToken);
export default router;