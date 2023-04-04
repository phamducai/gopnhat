/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { TimeOffLimitServices } from "../services/timeOffLimit.service";
import { messageBoolean, messageData } from "../utils/helper";

/**
 * Home page.
 * @route GET /
 */
export const get = async (
	req: Request,
	res: Response
): Promise<Response<any, Record<string, any>>> => {
	try {
		const result = await TimeOffLimitServices.findAll();
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
		const result = await TimeOffLimitServices.insert(data);
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
	const result = await TimeOffLimitServices.updateByGuid(guid, data);
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
	const result = await TimeOffLimitServices.deleteById(guid);
	try {
		return messageBoolean(result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};
export const updateTimeOffLimit = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { employeeGuid } = req.params;
    const data = req.body;
    const result = await TimeOffLimitServices.updateLimit(employeeGuid, data);
    try {
        return messageBoolean(result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};