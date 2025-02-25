import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/libs/base/base.service';
import { ProductVariant } from 'src/models/entity/product_variant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductVariantService extends BaseService<ProductVariant> {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {
    super(productVariantRepository);
  }
}
