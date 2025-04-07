import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';
import { PublicRoute } from 'src/decorators';
import { ProductTags } from 'src/models/entity/product_tags.entity';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { ProductTagService } from 'src/services/product_tag.service';

@Controller({
  version: '1',
  path: 'product_tag',
})
@PublicRoute()
export class CliProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @ApiOkResponse({ type: () => ProductTags })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProductTags> {
    const result = await this.productTagService.findByIdOrFail(id);
    return result;
  }

  @ApiExtraModels(ProductTags)
  @ApiOkResponse({ type: () => FindAndCountResponse<ProductTags> })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAndCount(
    @Query() query: BaseFindAndCountRequest,
  ): Promise<FindAndCountResponse<ProductTags>> {
    const result = await this.productTagService.findAll(query);
    return result;
  }
}
