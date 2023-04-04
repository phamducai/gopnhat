/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { TimeOffItemServices } from "../services/timeOffItem.service";
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
        const result = await TimeOffItemServices.findAll();
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
        const result = await TimeOffItemServices.findAllByEmployee(guid);
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
        const result = await TimeOffItemServices.findOne(guid);
        return messageData(true, result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};
export const getOneByApplicantGuid = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { guid } = req.params;
        const result = await TimeOffItemServices.findOneByGuid(guid);
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
        const result = await TimeOffItemServices.insert(data);
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
    const result = await TimeOffItemServices.updateByGuid(guid, data);
    try {
        return messageBoolean(result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};

export const updateByApplicant = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const data = req.body;
    await TimeOffItemServices.updateStatusByApplicant(data.applicantGuid, data.status);
    try {
        return messageBoolean(true, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};

export const deleteMe = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { guid } = req.params;
    const result = await TimeOffItemServices.deleteById(guid);
    try {
        return messageBoolean(result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};
