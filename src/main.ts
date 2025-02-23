import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import AppLoggerService from './libs/logger';

async function bootstrap() {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(helmet());

  app.use(cookieParser());

  app.useLogger(app.get(AppLoggerService));

  app.setGlobalPrefix(configService.get<string>('prefix'));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('version'),
  });

  const port = configService.get<number>('port');

  await app.listen(port, () => {
    const logger: Logger = new Logger('Server connection');
    logger.log(`⛩️  Gateway has started successfully running on port ${port}`);
  });
}
bootstrap();
