import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { get, isNil } from 'lodash';
import { ErrorDictionary } from 'src/enums/error.dictionary';
import { BaseService } from 'src/libs/base/base.service';
import { Category } from 'src/models/entity/category.entity';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { CreateCategoryRequest } from 'src/models/request/create-category.request';
import { CreatedResponse } from 'src/models/response/created.response';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  async update(id: string, data: CreateCategoryRequest): Promise<void> {
    const parentId = get(data, 'parentId', null);

    if (!isNil(parentId)) {
      await this.validate({ categoryId: parentId });
    }

    await this.updateById(id, data);
  }

  async validate({ categoryId, slug }: { categoryId?: string; slug?: string }) {
    if (slug) {
      const existingCategoryBySlug = await this.existsBy({ where: { slug } });

      if (existingCategoryBySlug) {
        throw new ConflictException({
          code: ErrorDictionary.CATEGORY_SLUG_TAKEN,
          statusCode: HttpStatus.CONFLICT,
        });
      }
    }

    if (categoryId) await this.findByIdOrFail(categoryId);
  }

  async findAll({
    offset,
    limit,
    q,
  }: BaseFindAndCountRequest): Promise<FindAndCountResponse<Category>> {
    return await this.findAndCount({
      where: {
        ...(q && { name: ILike(`%${q}%`) }),
      },
      skip: offset,
      take: limit,
      relations: ['children'],
    });
  }

  async createCategory(
    request: CreateCategoryRequest,
  ): Promise<CreatedResponse> {
    const parentId = get(request, 'parentId', null);

    if (!isNil(parentId)) {
      await this.validate({ categoryId: parentId });

      return this.create({
        ...request,
        parent: { id: parentId },
      });
    }

    return await this.create(request);
  }
}
