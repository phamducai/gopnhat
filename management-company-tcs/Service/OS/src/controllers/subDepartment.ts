/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SubDepartmentServices } from "../services/subDepartment.service";
import { messageBoolean, messageData } from "../utils/helper";

/**
 * Home page.
 * @route GET /
 */
export const getSubDepartment = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
	try {
		const result = await SubDepartmentServices.findAllSubDepartment();

		return messageData(true, result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};
export const getSubDepartmentByDepartmentCode = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
	try {
		const { code } = req.params;
		const result = await SubDepartmentServices.getInforDepartment(code);

		return messageData(true, result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const insert = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
	const data = req.body;
	try {
		const result = await SubDepartmentServices.insertSubDepartment(data);
		return messageData(true, result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const update = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
	const { guid } = req.params;
	const data = req.body;
	const result = await SubDepartmentServices.updateSubDepartmentByGuid(
		guid,
		data
	);
	try {
		return messageBoolean(result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const deleteSubDepartment = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
	const { guid } = req.params;
	const result = await SubDepartmentServices.deleteSubDepartmentByGuId(guid);
	try {
		return messageBoolean(result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};


export const getSubDepartmentByGuidDepartment = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
	const { guid } = req.params;
	const result = await SubDepartmentServices.getSubDepartmentByGuidDeparment(guid);
	try {
		return messageData(true, result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};