import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Kafka,
  Consumer,
  ConsumerSubscribeTopics,
  ConsumerRunConfig,
} from 'kafkajs';
import { forEach } from 'lodash';

@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {}

  private kafkaClient: Kafka;
  private consumers: Consumer[] = [];

  async onModuleInit() {
    this.kafkaClient = new Kafka({
      brokers: this.configService.get<string[]>('kafka.brokers'),
      clientId: this.configService.get<string>('kafka.groupId'),
    });
  }

  async onModuleDestroy() {
    forEach(this.consumers, async (consumer) => {
      await consumer.disconnect();
    });
  }

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafkaClient.consumer({
      groupId: this.configService.get<string>('kafka.groupId'),
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
}
