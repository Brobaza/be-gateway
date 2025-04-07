// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Post,
//   Query,
//   UseGuards,
// } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiOkResponse,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import { CurrentUserId } from 'src/decorators';
// import { SessionType } from 'src/enums/session-type.enum';
// import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
// import { Product } from 'src/models/entity/product.entity';
// import { AddToWishListRequest } from 'src/models/request/add-to-wishlist.request';
// import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
// import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
// import { OkResponse } from 'src/models/response/ok.response';
// import { WishListService } from 'src/services/wish_lists.service';

// @ApiBearerAuth(SessionType.ACCESS)
// @Controller({
//   version: '1',
//   path: '/wish-list',
// })
// @UseGuards(JwtAccessTokenGuard)
// @ApiTags('Wish List')
// export class CliWishListController {
//   constructor(private readonly wishListService: WishListService) {}

//   @ApiResponse({ type: () => OkResponse })
//   @HttpCode(HttpStatus.OK)
//   @Post()
//   async create(
//     @CurrentUserId() userId: string,
//     @Body() body: AddToWishListRequest,
//   ): Promise<OkResponse> {
//     await this.wishListService.addToWishList(userId, body.productId);
//     return {
//       success: true,
//     };
//   }

//   @ApiOkResponse({ type: () => FindAndCountResponse<Product> })
//   @HttpCode(HttpStatus.OK)
//   @Get()
//   async find(
//     @CurrentUserId() userId: string,
//     @Query() query: BaseFindAndCountRequest,
//   ): Promise<FindAndCountResponse<Product>> {
//     return await this.wishListService.findAndCountCache(userId, query);
//   }
// }
