import dotenv from "dotenv";
dotenv.config();
export const rabbitMQSetting = {
    protocol: "amqp",
    hostname: process.env.HOST_RABBIT,
    port: 5672,
    username: process.env.USER_RABBIT,
    password: process.env.PASSWORD_RABBIT,
    vhost: "/",
    authMeChanism: ["PLAIN", "AMQPLAIN", "EXTERNAL"],
};
