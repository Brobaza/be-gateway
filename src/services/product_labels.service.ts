import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/libs/base/base.service';
import { ProductLabels } from 'src/models/entity/product_labels.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductLabelsService extends BaseService<ProductLabels> {
  constructor(
    @InjectRepository(ProductLabels)
    private readonly productLabelsRepository: Repository<ProductLabels>,
  ) {
    super(productLabelsRepository);
  }

  async removeByProductId(productId: string): Promise<void> {
    await this.productLabelsRepository.delete({ product: { id: productId } });
  }
}
