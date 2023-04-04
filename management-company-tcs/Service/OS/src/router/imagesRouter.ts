import express from "express";
import path from "path";
const router = express();
import * as ImagesController from "../controllers/images";
import { upload } from "../middleware/multer";
router.post("/uploads", upload.any(), ImagesController.uploads);
export default router;
