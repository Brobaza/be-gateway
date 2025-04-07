import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/decorators';
import { Category } from 'src/models/entity/category.entity';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { SlugRequest } from 'src/models/request/slug.request';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { CategoryService } from 'src/services/category.service';

@ApiTags('Categories')
@Controller({
  path: '/categories',
  version: '1',
})
@PublicRoute()
export class CliCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({ type: () => Category })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Category> {
    const result = await this.categoryService.findByIdOrFail(
      id,
      'children',
      'parent',
    );
    return result;
  }

  @ApiOkResponse({ type: () => Category })
  @HttpCode(HttpStatus.OK)
  @Get('/get-by-slug/:slug')
  async findBySlug(@Param() { slug }: SlugRequest): Promise<Category> {
    const result = await this.categoryService.findOneOrFail({
      where: { slug },
      relations: ['children', 'parent'],
    });

    return result;
  }

  @ApiExtraModels(Category)
  @ApiOkResponse({ type: () => FindAndCountResponse<Category> })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAndCount(
    @Query() query: BaseFindAndCountRequest,
  ): Promise<FindAndCountResponse<Category>> {
    const result = await this.categoryService.findAll(query);
    return result;
  }
}
