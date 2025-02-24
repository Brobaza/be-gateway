import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { AppController } from './controllers/app.controller';
import { AuthController } from './controllers/auth.controller';
import { loadConfiguration } from './libs/config';
import {
  MICROSERVICE_PACKAGE_NAME,
  MICROSERVICE_SERVICE_NAME,
} from './libs/constants/microservice.name';
import AppLoggerService from './libs/logger';
import { AppService } from './services/app.service';
import { AuthService } from './services/auth.service';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [() => loadConfiguration()],
    }),

    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: MICROSERVICE_SERVICE_NAME.USER_SERVICE,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            protoPath: join(__dirname, '../proto/user.service.proto'),
            package: MICROSERVICE_PACKAGE_NAME.USER_SERVICE,
            url: `${configService.get<string>('services.user.container_name')}:${configService.get<string>('services.user.port')}`,
          },
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: MICROSERVICE_SERVICE_NAME.AUTH_SERVICE,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            protoPath: join(__dirname, '../proto/auth.service.proto'),
            package: MICROSERVICE_PACKAGE_NAME.AUTH_SERVICE,
            url: `${configService.get<string>('services.auth.container_name')}:${configService.get<string>('services.auth.port')}`,
          },
        }),
        inject: [ConfigService],
      },
    ]),

    PassportModule.register({}),
    JwtModule.register({}),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, AuthController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    AppService,
    AppLoggerService,

    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,

    AuthService,
  ],
})
export class AppModule {}
