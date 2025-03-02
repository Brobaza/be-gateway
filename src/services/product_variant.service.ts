import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/libs/base/base.service';
import { ProductVariant } from 'src/models/entity/product_variant.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ProductVariantService extends BaseService<ProductVariant> {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {
    super(productVariantRepository);
  }

  async validate(productVariantId: string): Promise<ProductVariant> {
    const productVariant = await this.findById(productVariantId);

    if (!productVariant) {
      throw new Error('Product variant not found');
    }

    return productVariant;
  }

  async createProductVariant(
    title: string,
    price: number,
    salePrice: number,
    quantity: number,
    productId: string,
  ): Promise<ProductVariant> {
    if (!title || !price || !salePrice || !quantity || !productId) {
      throw new Error('All fields are required');
    }

    if (salePrice > price) {
      throw new Error('Sale price cannot be greater than price');
    }

    const { id } = await this.create({
      title,
      price,
      salePrice,
      quantity,
      product: { id: productId },
    });

    return this.findById(id);
  }

  async removeAllProductVariants(productId: string): Promise<void> {
    await this.softDelete({ product: { id: productId } });
  }

  async removeAllByQueryRunner(
    productId: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.softDelete(ProductVariant, {
      product: { id: productId },
    });
  }
}
