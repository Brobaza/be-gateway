import { Controller, Get } from '@nestjs/common';
import { QueueTopic } from 'src/enums/queue-topic.enum';
import { ProducerService } from 'src/queue/producer.service';
import { AppService } from 'src/services/app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly producerService: ProducerService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    await this.producerService.produce({
      topic: QueueTopic.TEST_TOPIC,
      messages: [
        {
          key: 'key',
          value: JSON.stringify({ message: 'Hello KafkaJS consumer!' }),
        },
      ],
    });
    return this.appService.getHello();
  }
}
