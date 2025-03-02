import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { AppController } from './controllers/app.controller';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { loadConfiguration } from './libs/config';
import {
  MICROSERVICE_PACKAGE_NAME,
  MICROSERVICE_SERVICE_NAME,
} from './libs/constants/microservice.name';
import AppLoggerService from './libs/logger';
import { AppService } from './services/app.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { Product } from './models/entity/product.entity';
import { Category } from './models/entity/category.entity';
import { ProductLabels } from './models/entity/product_labels.entity';
import { ProductRating } from './models/entity/product_rating.entity';
import { ProductReviews } from './models/entity/product_reviews.entity';
import { ProductTags } from './models/entity/product_tags.entity';
import { ProductVariant } from './models/entity/product_variant.entity';
import { TransactionDomain } from './domains/transaction.domain';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { ProductLabelsService } from './services/product_labels.service';
import { ProductRatingService } from './services/product_rating.service';
import { ProductReviewService } from './services/product_review.service';
import { ProductTagService } from './services/product_tag.service';
import { ProductVariantService } from './services/product_variant.service';
import { UserDomain } from './domains/user.domain';
import { CategoryController } from './controllers/category.controller';
import { Cart } from './models/entity/cart.entity';
import { DeliveryCenter } from './models/entity/delivery_center.entity';
import { Discount } from './models/entity/discount.entity';
import { Order } from './models/entity/order.entity';
import { ProductController } from './controllers/product.controller';
import { ProductTagController } from './controllers/product_tag.controller';
import { DeliveryHistory } from './models/entity/delivery_history.entity';
import { Notification } from './models/entity/notification.entity';
import { ConsumerService } from './queue/consumer.service';
import { ProducerService } from './queue/producer.service';
import { ClientQueueService } from './queue/client-queue.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [() => loadConfiguration()],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'postgres',
          host: configService.get<string>('postgres.host'),
          port: configService.get<number>('postgres.port'),
          username: configService.get<string>('postgres.username'),
          password: configService.get<string>('postgres.password'),
          database: configService.get<string>('postgres.database'),
          synchronize: !configService.get<boolean>('isProd'),
          dropSchema: false,
          logging: true,
          logger: 'advanced-console',
          autoLoadEntities: true,
          entities: [process.cwd() + 'src/**/*.entity.ts'],
        };
      },
    }),

    TypeOrmModule.forFeature([
      Product,
      Category,
      ProductLabels,
      ProductRating,
      ProductReviews,
      ProductTags,
      ProductVariant,
      Cart,
      DeliveryCenter,
      Discount,
      Notification,
      Order,
      DeliveryHistory,
    ]),

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
  controllers: [
    AppController,
    AuthController,
    UserController,
    CategoryController,
    ProductController,
    ProductTagController,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },

    // * apps
    AppService,
    AppLoggerService,

    // * strategies
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,

    // * db utils
    TransactionDomain,

    // * queue service
    ConsumerService,
    ProducerService,
    ClientQueueService,

    // * domain
    UserDomain,

    // * services
    AuthService,
    UserService,
    ProductService,
    CategoryService,
    ProductLabelsService,
    ProductRatingService,
    ProductReviewService,
    ProductTagService,
    ProductVariantService,
  ],
})
export class AppModule {}
