/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { IRequest } from "../interface/IRequest";
// import { consumeRegisterAccount } from "../rabbit/consume/create-account";
import { AccountServices } from "../services/accountService";
import { messageBoolean, messageData } from "../utils/helper";
/**
 * Home page.
 * @route GET /
 */
 export const getAll = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await AccountServices.findAll();
        return messageData(true, result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const insert = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
	const data = req.body;
	try {
		const result = await AccountServices.insertAccount(data);
		return messageData(true, result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const update = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
	const { guid } = req.params;
	const data = req.body;
	const result = await AccountServices.updateAccountByGuid(guid, data);
	try {
		return messageBoolean(result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const deletes = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
	const { guid } = req.params;
	const result = await AccountServices.deleteAccountById(guid);
	try {
		return messageBoolean(result, res);
	} catch (error) {
		return messageData(false, error, res);
	}
};

export const updatePassword = async (req: IRequest, res: Response): Promise<Response<any, Record<string, any>>> => {
	const { username } = req.users;
	const data = req.body;
	const result = await AccountServices.updatePassword(username, data);
	try {
		return messageBoolean(true, result);
	} catch (error) {
		return messageData(false, error, res);
	}
};