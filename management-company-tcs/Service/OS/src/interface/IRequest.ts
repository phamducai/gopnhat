import { Request } from "express";

export interface IRequest extends Request {
    users?: {
        GUID: string,
        Username: string,
        token?: string
    };
    // other additional attributes here, example:
    // surname?: string;
}