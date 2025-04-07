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
import { CreateProductRequest } from 'src/models/request/create-product.request';
import { IdRequest } from 'src/models/request/id.request';
import { UpdateProductRequest } from 'src/models/request/update-product.request';
import { CreatedResponse } from 'src/models/response/created.response';
import { OkResponse } from 'src/models/response/ok.response';
import { ProductService } from 'src/services/product.service';
import { OK_RESPONSE } from 'src/utils/constants';

@ApiBearerAuth(SessionType.ACCESS)
@ApiTags('Products')
@UseGuards(JwtAccessTokenGuard)
@Controller({
  version: '1',
  path: '/pla/products',
})
@AdminRoute()
export class PlaProductController {
  constructor(private readonly productsService: ProductService) {}

  @ApiCreatedResponse({ type: () => CreatedResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() request: CreateProductRequest,
  ): Promise<CreatedResponse> {
    const result = await this.productsService.createProduct(request);
    return result;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param() { id }: IdRequest,
    @Body() request: UpdateProductRequest,
  ): Promise<OkResponse> {
    await this.productsService.update(id, request);
    return OK_RESPONSE;
  }

  @ApiOkResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() { id }: IdRequest): Promise<OkResponse> {
    await this.productsService.softDeleteById(id);
    return OK_RESPONSE;
  }
}
