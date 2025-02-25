import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/libs/base/base.service';
import { ProductReviews } from 'src/models/entity/product_reviews.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductReviewService extends BaseService<ProductReviews> {
  constructor(
    @InjectRepository(ProductReviews)
    private productReviewRepository: Repository<ProductReviews>,
  ) {
    super(productReviewRepository);
  }
}
