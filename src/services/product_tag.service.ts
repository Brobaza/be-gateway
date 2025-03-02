import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/libs/base/base.service';
import { ProductTags } from 'src/models/entity/product_tags.entity';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ProductTagService extends BaseService<ProductTags> {
  constructor(
    @InjectRepository(ProductTags)
    private productTagRepository: Repository<ProductTags>,
  ) {
    super(productTagRepository);
  }

  async findAll({
    offset,
    limit,
    q,
  }: BaseFindAndCountRequest): Promise<FindAndCountResponse<ProductTags>> {
    return await this.findAndCount({
      where: {
        ...(q && { name: ILike(`%${q}%`) }),
      },
      skip: offset,
      take: limit,
      relations: [],
    });
  }
}
