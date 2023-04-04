import { Request } from "express";

export interface IRequest extends Request {
    users?: {
        GUID: string,
        username: string,
        token?: string
    };
    // other additional attributes here, example:
    // surname?: string;
}