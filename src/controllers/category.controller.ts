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
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicRoute } from 'src/decorators';
import { AdminRoute } from 'src/decorators/admin-route.decorator';
import { SessionType } from 'src/enums/session-type.enum';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { Category } from 'src/models/entity/category.entity';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { CreateCategoryRequest } from 'src/models/request/create-category.request';
import { IdRequest } from 'src/models/request/id.request';
import { SlugRequest } from 'src/models/request/slug.request';
import { CreatedResponse } from 'src/models/response/created.response';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { OkResponse } from 'src/models/response/ok.response';
import { CategoryService } from 'src/services/category.service';
import { OK_RESPONSE } from 'src/utils/constants';

@ApiTags('Categories')
@Controller({
  path: 'categories',
  version: '1',
})
@ApiBearerAuth(SessionType.ACCESS)
@UseGuards(JwtAccessTokenGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreatedResponse({ type: () => CreatedResponse })
  @HttpCode(HttpStatus.CREATED)
  @AdminRoute()
  @Post('/')
  async create(
    @Body() request: CreateCategoryRequest,
  ): Promise<CreatedResponse> {
    const result = await this.categoryService.create(request);
    return result;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @AdminRoute()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() request: CreateCategoryRequest,
  ): Promise<OkResponse> {
    await this.categoryService.update(id, request);
    return OK_RESPONSE;
  }

  @ApiOkResponse({ type: () => Category })
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
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
  @PublicRoute()
  @Get('/get-by-slug/:slug')
  async findBySlug(@Param() { slug }: SlugRequest): Promise<Category> {
    const result = await this.categoryService.findOneOrFail({
      where: { slug },
      relations: ['children', 'parent'],
    });

    return result;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.NO_CONTENT)
  @AdminRoute()
  @Delete(':id')
  async delete(@Param() { id }: IdRequest): Promise<OkResponse> {
    await this.categoryService.softDeleteById(id);
    return OK_RESPONSE;
  }

  @ApiExtraModels(Category)
  @ApiOkResponse({ type: () => FindAndCountResponse<Category> })
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
  @Get()
  async findAndCount(
    @Query() query: BaseFindAndCountRequest,
  ): Promise<FindAndCountResponse<Category>> {
    const result = await this.categoryService.findAll(query);
    return result;
  }
}
