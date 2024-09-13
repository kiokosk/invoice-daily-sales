import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private channel: amqp.Channel;
  private readonly logger = new Logger(RabbitMQService.name);

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      this.channel = await connection.createChannel();
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async publish(queue: string, message: any) {
    try {
      await this.channel.assertQueue(queue);
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      this.logger.log(`Message sent to queue "${queue}"`);
    } catch (error) {
      this.logger.error(`Failed to send message to queue "${queue}"`, error);
      throw error;
    }
  }

  async consume(queue: string, onMessage: (msg: amqp.ConsumeMessage) => void) {
    try {
      await this.channel.assertQueue(queue);
      this.channel.consume(queue, (msg) => {
        if (msg) {
          onMessage(msg);
          this.channel.ack(msg);
        }
      });
      this.logger.log(`Consuming messages from queue "${queue}"`);
    } catch (error) {
      this.logger.error(`Failed to consume messages from queue "${queue}"`, error);
      throw error;
    }
  }
}
