import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { forEach, get, head, last, map, reduce, sortBy } from 'lodash';
import { TransactionDomain } from 'src/domains/transaction.domain';
import { ErrorDictionary } from 'src/enums/error.dictionary';
import { InventoryType } from 'src/enums/inventory-type.enum';
import { ProductGender } from 'src/enums/product-gender.enum';
import { ProductLabelTypes } from 'src/enums/product_labels.enums';
import { BaseService } from 'src/libs/base/base.service';
import { Product } from 'src/models/entity/product.entity';
import { ProductLabels } from 'src/models/entity/product_labels.entity';
import { ProductRating } from 'src/models/entity/product_rating.entity';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { CreateProductRequest } from 'src/models/request/create-product.request';
import { CreatedResponse } from 'src/models/response/created.response';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { ILike, Repository } from 'typeorm';
import { ProductLabelsService } from './product_labels.service';
import { ProductVariantService } from './product_variant.service';
import { CreateProductVariantRequest } from 'src/models/request/create-product-variant.request';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productLabelService: ProductLabelsService,
    private readonly transactionDomain: TransactionDomain,
    private readonly productVariantService: ProductVariantService,
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
      relations: [
        'category',
        'product_rating',
        'product_variant',
        'product_reviews',
        'product_labels',
        'product_tags',
      ],
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

    const quantity = reduce(
      get(request, 'variants', []),
      (acc, variant: CreateProductVariantRequest) => {
        return acc + variant.quantity;
      },
      0,
    );

    const maxPrice = last(
      sortBy(
        get(request, 'variants', []),
        'price',
      ) as CreateProductVariantRequest[],
    )?.price;
    const minPrice = head(
      sortBy(
        get(request, 'variants', []) as CreateProductVariantRequest[],
        'salePrice',
      ),
    )?.salePrice;

    if (quantity < 1) {
      throw new ConflictException({
        code: ErrorDictionary.PRODUCT_QUANTITY_INVALID,
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const { id } = await this.transactionDomain.withTransaction(
      async (queryRunner) => {
        const { id: productId } = await queryRunner.manager.save(
          Product,
          queryRunner.manager.create(Product, {
            ...request,
            quantity,
            maxPrice,
            minPrice,
            inventoryStatus: request.inventoryStatus as InventoryType,
            genders: request.genders as ProductGender[],
            category: { id: request.categoryId },
          }),
        );

        await Promise.all(
          map(get(request, 'labels', []), (label) => {
            return queryRunner.manager.save(
              ProductLabels,
              queryRunner.manager.create(ProductLabels, {
                ...request,
                type: label.type as ProductLabelTypes,
                color: label.color,
                content: label.content,
                product: { id: productId },
              }),
            );
          }),
        );

        await Promise.all(
          map([1, 2, 3, 4, 5], (star) => {
            return queryRunner.manager.save(
              ProductRating,
              queryRunner.manager.create(ProductRating, {
                rating: star,
                starCount: 0,
                reviewCount: 0,
                product: { id: productId },
              }),
            );
          }),
        );

        await Promise.all(
          map(get(request, 'variants', []), (variant) => {
            return this.productVariantService.createProductVariant(
              variant.title,
              variant.price,
              variant.salePrice,
              variant.quantity,
              productId,
            );
          }),
        );

        return { id: productId };
      },
    );

    return { id };
  }

  async update(id: string, request: any): Promise<void> {
    await this.validate({ categoryId: request.categoryId, slug: request.slug });

    const currentProduct = await this.findOne({ where: { id } });

    if (!currentProduct) {
      throw new ConflictException({
        code: ErrorDictionary.PRODUCT_NOT_FOUND,
        statusCode: HttpStatus.CONFLICT,
      });
    }

    if (currentProduct.totalSold > request.quantity) {
      throw new ConflictException({
        code: ErrorDictionary.PRODUCT_QUANTITY_INVALID,
        statusCode: HttpStatus.CONFLICT,
      });
    }

    await this.transactionDomain.withTransaction(async (queryRunner) => {
      await this.productLabelService.removeAllByQueryRunner(
        currentProduct.id,
        queryRunner,
      );
      await this.productVariantService.removeAllByQueryRunner(
        currentProduct.id,
        queryRunner,
      );

      await Promise.all(
        get(request, 'labels', []).map((label: ProductLabels) =>
          queryRunner.manager.save(ProductLabels, {
            ...request,
            type: label.type as ProductLabelTypes,
            color: label.color,
            content: label.content,
            product: { id: currentProduct.id },
          }),
        ),
      );

      await Promise.all(
        get(request, 'variants', []).map(
          (variant: {
            title: string;
            price: number;
            salePrice: number;
            quantity: number;
          }) =>
            this.productVariantService.createProductVariant(
              variant.title,
              variant.price,
              variant.salePrice,
              variant.quantity,
              currentProduct.id,
            ),
        ),
      );

      await queryRunner.manager.update(
        Product,
        {
          id: currentProduct.id,
        },
        {
          ...request,
          inventoryStatus: request.inventoryStatus as InventoryType,
          genders: request.genders as ProductGender[],
          category: { id: request.categoryId },
        },
      );
    });
  }
}
