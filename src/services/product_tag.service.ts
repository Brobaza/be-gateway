import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/libs/base/base.service';
import { ProductTags } from 'src/models/entity/product_tags.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductTagService extends BaseService<ProductTags> {
  constructor(
    @InjectRepository(ProductTags)
    private productTagRepository: Repository<ProductTags>,
  ) {
    super(productTagRepository);
  }
}
