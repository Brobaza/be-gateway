// import {
//   forwardRef,
//   Inject,
//   Injectable,
//   Logger,
//   OnModuleInit,
// } from '@nestjs/common';
// import { isNil, replace } from 'lodash';
// import { CacheDomain } from 'src/domains/cache.domain';
// import { QueueTopic } from 'src/enums/queue-topic.enum';
// import { RedisKey } from 'src/enums/redis-key.enum';
// import { WishListService } from 'src/services/wish_lists.service';
// import { ConsumerService } from './consumer.service';

// @Injectable()
// export class WishlistQueueService implements OnModuleInit {
//   logger = new Logger(WishlistQueueService.name);

//   constructor(
//     private readonly consumerService: ConsumerService,
//     @Inject(forwardRef(() => WishListService))
//     private readonly wishlistService: WishListService,
//     private readonly cacheDomain: CacheDomain,
//   ) {}

//   getCacheKey(userId: string): string {
//     return replace(RedisKey.WISHLIST, '{userId}', userId);
//   }

//   async resetCache(key: string): Promise<void> {
//     const ttl = await this.cacheDomain.getRedisClient().ttl(key);

//     if (ttl === -1) {
//       await this.cacheDomain.getRedisClient().expire(key, 60 * 60 * 2);
//     }
//   }

//   async onModuleInit() {
//     await this.consumerService.consume(
//       {
//         topics: [QueueTopic.ADD_TO_WISH_LIST_ACTIVITY_TOPIC],
//         fromBeginning: true,
//       },
//       {
//         eachMessage: async ({
//           topic,
//           partition,
//           message,
//           heartbeat,
//           pause,
//         }) => {
//           try {
//             this.logger.log({
//               value: message.value.toString(),
//               topic: topic.toString(),
//               partition: partition.toString(),
//             });

//             const parsedMessage = JSON.parse(message.value.toString());
//             this.logger.log('Parsed message: ', parsedMessage);

//             await this.addToWishListActivity(parsedMessage);

//             await this.consumerService.commitOffset(
//               topic,
//               partition,
//               message.offset,
//             );

//             await heartbeat();
//           } catch (error) {
//             this.logger.error(
//               `Error processing message: ${error.message}`,
//               error.stack,
//             );
//             pause();
//           }
//         },
//       },
//     );
//   }

//   async addToWishListActivity(parsedMessage: any) {
//     const { userId, productId, product } = parsedMessage;
//     this.logger.log(
//       `Adding product ${productId} to wishlist of user ${userId}`,
//     );

//     const redis = this.cacheDomain.getRedisClient();

//     const userIdKey = this.getCacheKey(userId);

//     const isProductExistInWishlistCache = await redis.hexists(
//       userIdKey,
//       productId,
//     );

//     if (!isNil(isProductExistInWishlistCache)) {
//       this.logger.log(
//         `Product ${productId} already exists in wishlist of user ${userId}`,
//       );

//       await this.wishlistService.softDelete({
//         userId,
//         product: { id: productId },
//       });

//       await redis.hdel(userIdKey, productId);
//       return;
//     } else {
//       this.logger.log(
//         `Product ${productId} does not exist in wishlist of user ${userId}`,
//       );

//       await this.wishlistService.create({
//         userId,
//         product: { id: productId },
//       });

//       await redis.hset(userIdKey, productId, product);
//     }

//     await this.resetCache(userIdKey);
//   }
// }
