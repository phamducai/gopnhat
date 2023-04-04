import express from "express";
const router = express();
import * as homeController from "../controllers/product";

export const getRouterProduct = router.get("/:id", homeController.index);
export const getRouterProductAll = router.get("/", homeController.allProduct);
