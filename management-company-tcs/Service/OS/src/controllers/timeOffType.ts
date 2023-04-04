/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { TimeOffTypeServices } from "../services/timeOffType.service";
import { messageBoolean, messageData } from "../utils/helper";

/**
 * Home page.
 * @route GET /
 */
export const getOne = async (
	req: Request,
	res: Response
): Promise<Response<any, Record<string, any>>> => {
	try {
		const result = await TimeOffTypeServices.findAll();
		return messageData(true, result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const insert = async (
	req: Request,
	res: Response
): Promise<Response<any, Record<string, any>>> => {
	const data = req.body;
	try {
		const result = await TimeOffTypeServices.insert(data);
		return messageData(true, result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const update = async (
	req: Request,
	res: Response
): Promise<Response<any, Record<string, any>>> => {
	const { guid } = req.params;
	const data = req.body;
	const result = await TimeOffTypeServices.updateByGuid(guid, data);
	try {
		return messageBoolean(result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const deleteMe = async (
	req: Request,
	res: Response
): Promise<Response<any, Record<string, any>>> => {
	const { guid } = req.params;
	const result = await TimeOffTypeServices.deleteById(guid);
	try {
		return messageBoolean(result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};
