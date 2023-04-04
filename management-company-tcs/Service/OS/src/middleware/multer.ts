import express from "express";
import { IRequest } from "../interface/IRequest";
import multer from "multer";
import { createGuid } from "../utils/helper";

var storage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const guid = createGuid();
    cb(null, guid + "-" + file.originalname);
  },
});

const fileFilter = (req: IRequest, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1026 },
  fileFilter: fileFilter,
});
