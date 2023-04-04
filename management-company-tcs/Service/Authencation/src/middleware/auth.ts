import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Decoded } from "../models/decoded";
import { IRequest } from "../interface/IRequest";
const config = process.env;

export const verifyToken = (req: IRequest, res: Response, next: NextFunction) => {

    let token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        token = token.replace(/^Bearer\s+/, "");
        jwt.verify(token, config.KEY, function (err: any, decoded: Decoded) {
            if (err) {
                console.error(err.toString());
                //if (err) throw new Error(err)
                return res.status(401).json({ "message": 'Unauthorized access.', err });
            }
            req.users = decoded;
            next();
        });
    } catch (err) {
        console.log(err);

        return res.status(401).send("Invalid Token");
    }
};
