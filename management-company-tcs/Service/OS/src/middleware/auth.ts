import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { IRequest } from "../interface/IRequest";
// const config = process.env;
// import amqp, { Channel } from "amqplib";
// import { createGuid } from "../utils/helper";
// import { rabbitMQSetting } from "../config/connectRabit";
import { Decoded } from "../models/decoded";

export const verifyToken = async (req: IRequest, res: Response, next: NextFunction) => {
	let token = req.body.token || req.query.token || req.headers["authorization"];

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		token = token.replace(/^Bearer\s+/, "");
		jwt.verify(token, process.env.KEY, function (err: any, decoded: Decoded) {
			if (err) {
				console.error(err.toString());
				//if (err) throw new Error(err)
				return res.status(401).json({ "message": 'Unauthorized access.', err });
			}			
			req.users = decoded;
			next();
		});
		// const conn = await amqp.connect(rabbitMQSetting);
		// const channel = await conn.createChannel();
		// const GUID = createGuid();
		// const q = await channel.assertQueue("", { exclusive: true });
		// await channel.sendToQueue(
		// 	"verify-token",
		// 	Buffer.from(JSON.stringify(token)),
		// 	{
		// 		replyTo: q.queue,
		// 		correlationId: GUID,
		// 	}
		// );
		// await channel.consume(q.queue, (msg) => {
		// 	if (msg.properties.correlationId == GUID) {
		// 		const data = JSON.parse(msg.content.toString());
		// 		if (data.status === false) {
		// 			return res.status(401).send({
		// 				message: "Invalid Token",
		// 			});
		// 		} else {
		// 			req.users = data;
		// 			next();
		// 		}
		// 	}
		// 	setTimeout(() => {
		// 		conn.close();
		// 	}, 500);
		// },
		// 	{ noAck: true }
		// );
	} catch (err) {
		console.log(err);
		return res.status(401).send({
			message: "Invalid Token",
		});
	}
};
