/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SubDepartmentServices } from "../services/subDepartment.service";
import { EmployeeServices } from "../services/employee.service";
import { messageBoolean, messageData } from "../utils/helper";
import { TimeOffLimitServices } from "../services/timeOffLimit.service";
import { TimeOffLimit } from "../models/timeOffLimit";

// import amqp from "amqplib";
// import { createGuid } from "../utils/helper";
// import { rabbitMQSetting } from "../config/connectRabit";

/**
 * Home page.
 * @route GET /
 */
export const get = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const result = await EmployeeServices.findAll();
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
        const result = await EmployeeServices.findOne(guid);
        return messageData(true, result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};
export const getByAccount = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { guid } = req.params;
        const result = await EmployeeServices.findByAccount(guid);
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
        if (data.SubDepartmentGuid) {
            if (
                checkValidSubDepartment(
                    data.DepartmentGuid,
                    data.SubDepartmentGuid
                )
            ) {
                try {
                    const result = await EmployeeServices.insert(data);
                    if (result) {
                        const timeOffLimit: TimeOffLimit = {
                            EmployeeGuid: result.GUID,
                            Status: 1,
                            TimeOffLimit: 14,
                        };
                        await TimeOffLimitServices.insert(timeOffLimit);
                    }
                    return messageData(true, result, res);
                } catch (error) {
                    return messageData(false, error, res);
                }
                // //RabbitMQ
                // const conn = await amqp.connect(rabbitMQSetting);
                // const channel = await conn.createChannel();
                // const GUID = createGuid();
                // const q = await channel.assertQueue("", { exclusive: true });
                // await channel.sendToQueue(
                //   "create-account",
                //   Buffer.from(JSON.stringify(message)),
                //   {
                //     replyTo: q.queue,
                //     correlationId: GUID,
                //   }
                // );
                // await channel.consume(
                //   q.queue,
                //   (msg) => {
                //     if (msg.properties.correlationId == GUID) {
                //       const data = JSON.parse(msg.content.toString());
                //       return messageData(true, data, res);
                //     }
                //     // setTimeout(() => {
                //     //   conn.close();
                //     // }, 500);
                //   },
                //   { noAck: true }
                // );
            } else {
                return messageData(false, { message: "Invalid Request!" }, res);
            }
        } else {
            try {
                const result = await EmployeeServices.insert(data);
                return messageData(true, result, res);
            } catch (error) {
                return messageData(false, error, res);
            }
        }
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
    const result = await EmployeeServices.update(guid, data);
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
    const result = await EmployeeServices.deleteMe(guid);
    try {
        return messageBoolean(result, res);
    } catch (error) {
        return messageData(false, error, res);
    }
};

const checkValidSubDepartment = async (
    departmentGuid: string,
    subDepartmentGuid: string
) => {
    const listSubDepartment = await SubDepartmentServices.findByParentId(
        departmentGuid
    );
    const nameList = listSubDepartment.map((dt) => dt.Name);
    if (nameList.includes(subDepartmentGuid)) return true;
};

export const getAllEmployeeByDepartment = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { guid } = req.params;
        const { pageSize, pageNumber } = req.query;
        const paginate = { pageSize: Number.parseInt(JSON.stringify(JSON.parse(pageSize as string))), pageNumber: Number.parseInt(JSON.stringify(JSON.parse(pageNumber as string))) };
        const formSearch = req.body;
            
        const result = await EmployeeServices.getAllEmployeeByDepartmentGuid(guid, paginate, formSearch);
        return messageData(true, result, res);
    } catch (error) {
        console.log(error);
        return messageData(false, error, res);
    }
};

export const getTimeOffLimitInfo = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    try {
        const { guid } = req.params;
        const result = await EmployeeServices.getTimeOffLimitInfo(guid);
        return messageData(true, result, res);
    } catch (error) {
        console.log(error);
        return messageData(false, error, res);
    }
};
