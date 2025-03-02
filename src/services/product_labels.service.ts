import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/libs/base/base.service';
import { ProductLabels } from 'src/models/entity/product_labels.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ProductLabelsService extends BaseService<ProductLabels> {
  constructor(
    @InjectRepository(ProductLabels)
    private readonly productLabelsRepository: Repository<ProductLabels>,
  ) {
    super(productLabelsRepository);
  }

  async removeByProductId(productId: string): Promise<void> {
    await this.productLabelsRepository.softDelete({
      product: { id: productId },
    });
  }

  async removeAllByQueryRunner(
    productId: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.softDelete(ProductLabels, {
      product: { id: productId },
    });
  }
}
