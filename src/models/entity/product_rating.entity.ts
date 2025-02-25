import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_rating' })
export class ProductRating extends BaseEntity {
  @ApiProperty({ example: 5 })
  @Column({ type: 'int' })
  @Check(`"rating" >= 0 AND "rating" <= 5`)
  rating: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', default: 0 })
  starCount: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @ManyToOne(() => Product, (product) => product.ratings)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
