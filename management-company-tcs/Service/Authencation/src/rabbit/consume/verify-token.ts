import amqp from "amqplib";
import { AuthServices } from "../../services/authService";
import { rabbitMQSetting } from "../../config/connectRabit";

export const consumeVerifyToken = async (queue: string) => {
  try {
    const connection = await amqp.connect(rabbitMQSetting);
    const channel = await connection.createChannel();
    const q = await channel.assertQueue(queue);

    channel.once("error", (error) => {
      console.error(error);
    });

    channel.consume(queue, async (message) => {
      const token = JSON.parse(message.content.toString());
      channel.ack(message);
      const result = await AuthServices.verifyToken(token);
      channel.sendToQueue(
        message.properties.replyTo,
        Buffer.from(JSON.stringify(result)),
        {
          replyTo: q.queue,
          correlationId: message.properties.correlationId,
        }
      );
    });
  } catch (error) {
    console.log("Error", error);
  }
};
