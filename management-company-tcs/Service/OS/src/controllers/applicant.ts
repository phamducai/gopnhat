/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ApplicantServices } from "../services/applicant.service";
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
        const result = await ApplicantServices.findAll();
        return messageData(true, result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};
export const getOne = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { guid } = req.params;
        const result = await ApplicantServices.findOneByGuid(guid);
        return messageData(true, result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};
export const getByEmployee = async (
	req: Request,
	res: Response
): Promise<Response<any, Record<string, any>>> => {
	try {
		const { guid } = req.params;
		const result = await ApplicantServices.findAllByEmployee(guid);        
		return messageData(true, result, res);
	} catch (error) {
        console.log(error);
        
		return messageData(false, error, res);
	}
};

export const insert = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const data = req.body;
    if (data.items.length === 0) {
        return messageData(
            false,
            { code: 400, sqlMessage: "Invalid Request" },
            res
        );
    }
    try {
        const check = await ApplicantServices.findExisted(data.applicant.EmployeeGuid, data.applicant.DateFrom, data.applicant.DateTo);
        if (check.length > 0) {
            return messageData(
                false,
                { code: 409, sqlMessage: "Đã có đơn chờ trong ngày đăng ký!" },
                res
            );
        }
        const result = await ApplicantServices.insert(data);
        return messageData(true, result, res);
    } catch (error) {
        console.log(error);

        return messageData(false, error, res);
    }
};

export const update = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { guid } = req.params;
    const data = req.body;
    const result = await ApplicantServices.updateByGuid(guid, data);
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
    const result = await ApplicantServices.deleteById(guid);
    try {
        return messageBoolean(result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};
