/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { AuthServices } from "../services/authService";
import { messageData } from "../utils/helper";

/**
 * Home page.
 * @route GET /
 */

export const login = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const data = req.body;
  try {
    const result = await AuthServices.Login(data);
    if (result.status == false) {
      return messageData(false, result, res);
    } else {
      return messageData(true, result, res);
    }
  } catch (error) {
    return messageData(false, error, res);
  }
};

export const accessToken = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { token } = req.body;
  try {
    const result = await AuthServices.AccessToken(token);
    return messageData(true, result, res);
  } catch (error) {
    return messageData(false, error, res);
  }
};

export const verifyToken = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { token } = req.body;
  try {
    const result = await AuthServices.verifyToken(token);
    return messageData(true, result, res);
  } catch (error) {
    return messageData(false, error, res);
  }
};
