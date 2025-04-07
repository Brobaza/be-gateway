// import { forwardRef, Inject, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UserDomain } from 'src/domains/user.domain';
// import { QueueTopic } from 'src/enums/queue-topic.enum';
// import { BaseService } from 'src/libs/base/base.service';
// import { WishList } from 'src/models/entity/wish_list.entity';
// import { ProducerService } from 'src/queue/producer.service';
// import { Repository } from 'typeorm';
// import { ProductService } from './product.service';
// import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
// import { WishlistQueueService } from 'src/queue/wishlist-queue.service';
// import { CacheDomain } from 'src/domains/cache.domain';
// import { isEmpty, map, slice } from 'lodash';
// import { Product } from 'src/models/entity/product.entity';

// @Injectable()
// export class WishListService extends BaseService<WishList> {
//   constructor(
//     @InjectRepository(WishList)
//     private readonly wishListRepository: Repository<WishList>,
//     private readonly userDomain: UserDomain,
//     private readonly producerService: ProducerService,
//     private readonly productService: ProductService,
//     private readonly cacheDomain: CacheDomain,
//     @Inject(forwardRef(() => WishlistQueueService))
//     private readonly wishlistQueueService: WishlistQueueService,
//   ) {
//     super(wishListRepository);
//   }

//   async addToWishList(userId: string, productId: string) {
//     await this.userDomain.getUserThroughId(userId);

//     const product = await this.productService.findByIdOrFail(productId);

//     await this.producerService.produce({
//       topic: QueueTopic.ADD_TO_WISH_LIST_ACTIVITY_TOPIC,
//       messages: [
//         {
//           key: userId,
//           value: JSON.stringify({ userId, productId, product }),
//         },
//       ],
//     });
//   }

//   async findAndCountCache(
//     userId: string,
//     query: BaseFindAndCountRequest,
//   ): Promise<{ items: Product[]; total: number }> {
//     const { offset, limit } = query;
//     const redisKey = this.wishlistQueueService.getCacheKey(userId);

//     const redisClient = this.cacheDomain.getRedisClient();

//     const productsValues = await redisClient.hvals(redisKey);

//     if (!isEmpty(productsValues)) {
//       const items = map(productsValues, (value) => JSON.parse(value));

//       const total = items.length;

//       const paginatedItems = slice(items, offset, offset + limit);

//       return {
//         items: paginatedItems,
//         total,
//       };
//     }

//     const { items: wishlists, total } = await this.findAndCount({
//       where: {
//         userId,
//       },
//       skip: offset,
//       take: limit,
//       relations: ['product'],
//     });

//     const products = map(wishlists, (item) => item.product);

//     if (!isEmpty(products)) {
//       await this.updateCache(userId, products);
//     }

//     return {
//       items: products,
//       total,
//     };
//   }

//   async updateCache(userId: string, products: Product[]) {
//     const redisKey = this.wishlistQueueService.getCacheKey(userId);

//     const redisClient = this.cacheDomain.getRedisClient();

//     const pipeline = redisClient.pipeline();
//     products.forEach((product) => {
//       pipeline.hset(redisKey, product.id, JSON.stringify(product));
//     });
//     await pipeline.exec();

//     const ttl = await redisClient.ttl(redisKey);
//     if (ttl === -1 || ttl === -2) {
//       await redisClient.expire(redisKey, 60 * 60 * 2);
//     }
//   }
// }
