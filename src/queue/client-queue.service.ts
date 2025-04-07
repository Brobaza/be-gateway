import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueTopic } from 'src/enums/queue-topic.enum';
import { ConsumerService } from './consumer.service';

@Injectable()
export class ClientQueueService implements OnModuleInit {
  logger = new Logger(ClientQueueService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly consumerService: ConsumerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: [QueueTopic.TEST_TOPIC], fromBeginning: true },
      {
        eachMessage: async ({
          topic,
          partition,
          message,
          heartbeat,
          pause,
        }) => {
          try {
            this.logger.log({
              value: message.value.toString(),
              topic: topic.toString(),
              partition: partition.toString(),
            });

            const parsedMessage = JSON.parse(message.value.toString());
            this.logger.log(parsedMessage);

            await this.consumerService.commitOffset(
              topic,
              partition,
              message.offset,
            );

            await heartbeat();
          } catch (error) {
            this.logger.error(
              `Error processing message: ${error.message}`,
              error.stack,
            );
            pause();
          }
        },
      },
    );
  }
}
