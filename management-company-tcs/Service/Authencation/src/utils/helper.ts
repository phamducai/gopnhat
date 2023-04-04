import { Response } from "express";
import { v4 as uuid } from 'uuid';

export const createGuid = () => {
    const GUID: string = uuid();
    return GUID;
}

export const messageBoolean = (status: boolean, res: Response) => {
    if (status == true) {
        return res.status(200).json({
            status: true
        })
    } else {
        return res.status(400).json({
            status: false
        })
    }
}


export const messageData = (status: boolean, result: any, res: Response) => {
    if (status == true) {
        return res.status(200).json({
            status: true,
            data: result
        })
    } else {
        return res.status(400).json({
            status: false,
            error: result
        })
    }
}