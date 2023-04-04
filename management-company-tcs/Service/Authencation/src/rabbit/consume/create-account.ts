import amqp from "amqplib";
import { rabbitMQSetting } from "../../config/connectRabit";
import { AccountServices } from "../../services/accountService";


export const consumeRegisterAccount = async (queue: string) => {
  try {
    const connection = await amqp.connect(rabbitMQSetting);
    const channel = await connection.createChannel();
    const q = await channel.assertQueue(queue);

    channel.once("error", (error) => {
      console.error(error);
    });

    channel.consume(queue, async (message) => {
      const result = JSON.parse(message.content.toString());
      channel.ack(message);
      const response = await AccountServices.insertAccount(result);
      channel.sendToQueue(message.properties.replyTo, Buffer.from(JSON.stringify(response)), {
        replyTo: q.queue,
        correlationId: message.properties.correlationId,
      });
    });
  } catch (error) {
    console.log("Error", error);
  }
};
