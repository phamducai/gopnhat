import { Request, Response } from "express";
import { messageBoolean, messageData } from "../utils/helper";
export const uploads = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const name = [];
    const files = req.files as Express.Multer.File[];
    if (files.length > 0) {
      for (var file of files) {
        const { filename } = file;
        name.push(filename);
      }
      return messageData(true, name, res);
    } else {
      return messageData(false, {errno: "Unsupported file format"}, res);
    }
  } catch (error) {}
};
