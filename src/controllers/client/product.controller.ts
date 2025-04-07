import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/decorators';
import { Product } from 'src/models/entity/product.entity';
import { FindProductRequest } from 'src/models/request/find-product.request';
import { IdRequest } from 'src/models/request/id.request';
import { SlugRequest } from 'src/models/request/slug.request';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { ProductService } from 'src/services/product.service';

@ApiTags('Products')
@Controller({
  version: '1',
  path: 'products',
})
@PublicRoute()
export class CliProductController {
  constructor(private readonly productsService: ProductService) {}

  @ApiOkResponse({ type: () => Product })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param() { id }: IdRequest): Promise<Product> {
    const result = await this.productsService.findByIdOrFail(
      id,
      'category',
      'product_rating',
      'product_variant',
      'product_reviews',
      'product_labels',
      'product_tags',
    );
    return result;
  }

  @ApiOkResponse({ type: () => Product })
  @HttpCode(HttpStatus.OK)
  @Get('/get-by-slug/:slug')
  async findBySlug(@Param() { slug }: SlugRequest): Promise<Product> {
    const result = await this.productsService.findBySlug(
      slug,
      'category',
      'product_rating',
      'product_variant',
      'product_reviews',
      'product_labels',
      'product_tags',
    );
    return result;
  }

  @ApiOkResponse({ type: () => FindAndCountResponse<Product> })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAndCount(
    @Query() query: FindProductRequest,
  ): Promise<FindAndCountResponse<Product>> {
    const result = this.productsService.findAll(query);
    return result;
  }
}
