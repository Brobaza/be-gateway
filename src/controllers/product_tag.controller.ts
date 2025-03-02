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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PublicRoute } from 'src/decorators';
import { AdminRoute } from 'src/decorators/admin-route.decorator';
import { ProductTags } from 'src/models/entity/product_tags.entity';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { CreateCategoryRequest } from 'src/models/request/create-category.request';
import { CreateProductTagRequest } from 'src/models/request/create-product-tag.request';
import { IdRequest } from 'src/models/request/id.request';
import { CreatedResponse } from 'src/models/response/created.response';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { OkResponse } from 'src/models/response/ok.response';
import { ProductTagService } from 'src/services/product_tag.service';
import { OK_RESPONSE } from 'src/utils/constants';

@Controller({
  version: '1',
  path: 'product_tag',
})
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @ApiCreatedResponse({ type: () => CreatedResponse })
  @HttpCode(HttpStatus.CREATED)
  @AdminRoute()
  @Post('/')
  async create(
    @Body() request: CreateProductTagRequest,
  ): Promise<CreatedResponse> {
    const result = await this.productTagService.create(request);
    return result;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @AdminRoute()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() request: CreateProductTagRequest,
  ): Promise<OkResponse> {
    await this.productTagService.updateById(id, request);
    return OK_RESPONSE;
  }

  @ApiOkResponse({ type: () => ProductTags })
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProductTags> {
    const result = await this.productTagService.findByIdOrFail(id);
    return result;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminRoute()
  @Delete(':id')
  async delete(@Param() { id }: IdRequest): Promise<OkResponse> {
    await this.productTagService.softDeleteById(id);
    return OK_RESPONSE;
  }

  @ApiExtraModels(ProductTags)
  @ApiOkResponse({ type: () => FindAndCountResponse<ProductTags> })
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
  @Get()
  async findAndCount(
    @Query() query: BaseFindAndCountRequest,
  ): Promise<FindAndCountResponse<ProductTags>> {
    const result = await this.productTagService.findAll(query);
    return result;
  }
}
