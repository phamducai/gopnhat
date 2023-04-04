import amqp, { Channel } from "amqplib";

const rabbitMQSetting = {
  protocol: "amqp",
  hostname: "localhost",
  port: 5672,
  username: "guest",
  password: "guest",
  vhost: "/",
  authMeChanism: ["PLAIN", "EXTERNAL"],
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Queue = async (queue: string, msg: any) => {
  const conn = await amqp.connect(rabbitMQSetting);

  const channel = await conn.createChannel();

  await channel.assertQueue(queue);
  
  //await channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
};
