/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { CompanyServices } from "../services/company.service";
import { messageBoolean, messageData } from "../utils/helper";

/**
 * Home page.
 * @route GET /
 */
export const getComany = async (
	req: Request,
	res: Response
): Promise<Response<any, Record<string, any>>> => {
	try {
		const result = await CompanyServices.findAllCompany();
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
		const result = await CompanyServices.insertCompany(data);
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
	const result = await CompanyServices.updateCompanyByGuid(guid, data);
	try {
		return messageBoolean(result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const deleteCompany = async (
	req: Request,
	res: Response
): Promise<Response<any, Record<string, any>>> => {
	const { guid } = req.params;
	const result = await CompanyServices.deleteCompanyById(guid);
	try {
		return messageBoolean(result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};
