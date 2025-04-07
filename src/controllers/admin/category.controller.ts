import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRoute } from 'src/decorators/admin-route.decorator';
import { SessionType } from 'src/enums/session-type.enum';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { CreateCategoryRequest } from 'src/models/request/create-category.request';
import { IdRequest } from 'src/models/request/id.request';
import { CreatedResponse } from 'src/models/response/created.response';
import { OkResponse } from 'src/models/response/ok.response';
import { CategoryService } from 'src/services/category.service';
import { OK_RESPONSE } from 'src/utils/constants';

@ApiTags('Categories')
@Controller({
  path: '/pla/categories',
  version: '1',
})
@ApiBearerAuth(SessionType.ACCESS)
@UseGuards(JwtAccessTokenGuard)
@AdminRoute()
export class PlaCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreatedResponse({ type: () => CreatedResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async create(
    @Body() request: CreateCategoryRequest,
  ): Promise<CreatedResponse> {
    const result = await this.categoryService.createCategory(request);
    return result;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() request: CreateCategoryRequest,
  ): Promise<OkResponse> {
    await this.categoryService.update(id, request);
    return OK_RESPONSE;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() { id }: IdRequest): Promise<OkResponse> {
    await this.categoryService.softDeleteById(id);
    return OK_RESPONSE;
  }
}
