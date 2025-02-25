import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/libs/base/base.service';
import { ProductRating } from 'src/models/entity/product_rating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRatingService extends BaseService<ProductRating> {
  constructor(
    @InjectRepository(ProductRating)
    private readonly productRatingRepository: Repository<ProductRating>,
  ) {
    super(productRatingRepository);
  }
}
