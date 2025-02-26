import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { forEach, get, head } from 'lodash';
import { TransactionDomain } from 'src/domains/transaction.domain';
import { ErrorDictionary } from 'src/enums/error.dictionary';
import { InventoryType } from 'src/enums/inventory-type.enum';
import { ProductGender } from 'src/enums/product-gender.enum';
import { ProductLabelTypes } from 'src/enums/product_labels.enums';
import { BaseService } from 'src/libs/base/base.service';
import { Product } from 'src/models/entity/product.entity';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { CreateProductRequest } from 'src/models/request/create-product.request';
import { CreatedResponse } from 'src/models/response/created.response';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { ILike, Repository } from 'typeorm';
import { ProductLabelsService } from './product_labels.service';
import { ProductLabels } from 'src/models/entity/product_labels.entity';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productLabelService: ProductLabelsService,
    private readonly transactionDomain: TransactionDomain,
  ) {
    super(productRepository);
  }

  async findAll({
    offset,
    limit,
    q,
  }: BaseFindAndCountRequest): Promise<FindAndCountResponse<Product>> {
    return await this.findAndCount({
      where: {
        ...(q && { name: ILike(`%${q}%`) }),
      },
      skip: offset,
      take: limit,
      relations: ['children'],
    });
  }

  async validate({ categoryId, slug }: { categoryId?: string; slug?: string }) {
    if (slug) {
      const existingProductBySlug = await this.existsBy({ where: { slug } });

      if (existingProductBySlug) {
        throw new ConflictException({
          code: ErrorDictionary.PRODUCT_SLUG_TAKEN,
          statusCode: HttpStatus.CONFLICT,
        });
      }
    }

    if (categoryId) await this.findByIdOrFail(categoryId);
  }

  async createProduct(request: CreateProductRequest): Promise<CreatedResponse> {
    await this.validate({ categoryId: request.categoryId, slug: request.slug });

    const { id } = await this.transactionDomain.withTransaction(
      async (queryRunner) => {
        const { id: productId } = await queryRunner.manager.save(
          Product,
          queryRunner.manager.create(Product, {
            ...request,
            inventoryStatus: request.inventoryStatus as InventoryType,
            genders: request.genders as ProductGender[],
            category: { id: request.categoryId },
          }),
        );

        forEach(get(request, 'labels', []), async (label) => {
          await queryRunner.manager.save(
            ProductLabels,
            queryRunner.manager.create(ProductLabels, {
              ...request,
              type: label.type as ProductLabelTypes,
              color: label.color,
              content: label.content,
              product: { id: productId },
            }),
          );
        });

        return { id: productId };
      },
    );

    return { id };
  }

  async update(id: string, request: any): Promise<void> {
    await this.validate({ categoryId: request.categoryId, slug: request.slug });

    const countProduct = await this.findAndCount({
      where: { id },
    });

    if (countProduct.total === 0) {
      throw new ConflictException({
        code: ErrorDictionary.PRODUCT_NOT_FOUND,
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const currentProduct = head(countProduct.items);

    if (currentProduct.totalSold > request.quantity) {
      throw new ConflictException({
        code: ErrorDictionary.PRODUCT_QUANTITY_INVALID,
        statusCode: HttpStatus.CONFLICT,
      });
    }

    await this.transactionDomain.withTransaction(async (queryRunner) => {
      await this.productLabelService.removeByProductId(currentProduct.id);

      forEach(get(request, 'labels', []), async (label) => {
        await queryRunner.manager.save(
          ProductLabels,
          queryRunner.manager.create(ProductLabels, {
            ...request,
            type: label.type as ProductLabelTypes,
            color: label.color,
            content: label.content,
            product: { id: currentProduct.id },
          }),
        );
      });
    });

    await this.updateById(id, {
      ...request,
      inventoryStatus: request.inventoryStatus as InventoryType,
      genders: request.genders as ProductGender[],
      category: { id: request.categoryId },
    });
  }
}
