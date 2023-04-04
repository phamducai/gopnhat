/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { DepartmentServices } from "../services/department.service";
import { messageBoolean, messageData } from "../utils/helper";

/**
 * Home page.
 * @route GET /
 */
export const getDepartment = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const { companyId } = req.params;
        const result = await DepartmentServices.findDepartmentByParentId(companyId);
        return messageData(true, result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};

export const getDepartmentByCode = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const { code } = req.params;
        const result = await DepartmentServices.findDepartmentByCode(code);
        return messageData(true, result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};

export const insert = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const data = req.body;
    try {
        const result = await DepartmentServices.insertDepartment(data);
        return messageData(true, result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};

export const update = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const { guid } = req.params;
    const data = req.body;
    const result = await DepartmentServices.updateDepartmentByGuid(guid, data);
    try {
        return messageBoolean(result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const { guid } = req.params;
    const result = await DepartmentServices.deleteDepartmentById(guid);
    try {
        return messageBoolean(result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};