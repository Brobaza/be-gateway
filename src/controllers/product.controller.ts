import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicRoute } from 'src/decorators';
import { SessionType } from 'src/enums/session-type.enum';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { IdRequest } from 'src/models/request/id.request';
import { SlugRequest } from 'src/models/request/slug.request';
import { CreatedResponse } from 'src/models/response/created.response';
import { OkResponse } from 'src/models/response/ok.response';
import { OK_RESPONSE } from 'src/utils/constants';
import { AdminRoute } from 'src/decorators/admin-route.decorator';
import { ProductService } from 'src/services/product.service';
import { Product } from 'src/models/entity/product.entity';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { CreateProductRequest } from 'src/models/request/create-product.request';
import { UpdateProductRequest } from 'src/models/request/update-product.request';

@ApiBearerAuth(SessionType.ACCESS)
@ApiTags('Products')
@UseGuards(JwtAccessTokenGuard)
@Controller({
  version: '1',
  path: 'products',
})
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @ApiCreatedResponse({ type: () => CreatedResponse })
  @HttpCode(HttpStatus.CREATED)
  @AdminRoute()
  @Post()
  async create(
    @Body() request: CreateProductRequest,
  ): Promise<CreatedResponse> {
    const result = await this.productsService.createProduct(request);
    return result;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @AdminRoute()
  @Patch(':id')
  async update(
    @Param() { id }: IdRequest,
    @Body() request: UpdateProductRequest,
  ): Promise<OkResponse> {
    await this.productsService.update(id, request);
    return OK_RESPONSE;
  }

  @ApiOkResponse({ type: () => Product })
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
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
  @PublicRoute()
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
  @PublicRoute()
  @Get()
  async findAndCount(
    @Query() query: BaseFindAndCountRequest,
  ): Promise<FindAndCountResponse<Product>> {
    const result = this.productsService.findAll(query);
    return result;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminRoute()
  @Delete(':id')
  async delete(@Param() { id }: IdRequest): Promise<OkResponse> {
    await this.productsService.softDeleteById(id);
    return OK_RESPONSE;
  }
}
