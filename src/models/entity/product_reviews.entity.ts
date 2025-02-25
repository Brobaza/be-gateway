import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_reviews' })
export class ProductReviews extends BaseEntity {
  @ApiProperty({ example: 'good' })
  @Column({ type: 'text', nullable: false })
  comment: string;

  @ApiProperty({ example: 5 })
  @Column({ type: 'int', nullable: false, default: 0 })
  helpful: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', nullable: false, default: 0 })
  notHelpful: number;

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', nullable: false, default: false })
  isPurchased: boolean;

  @ApiProperty({ example: 5 })
  @Column({ type: 'int', nullable: false, default: 0 })
  @Check(`rating >= 0 AND rating <= 5`)
  rating: number;

  @ApiProperty({ example: ['https://attachment.jpg'] })
  @Column({ type: 'varchar', array: true, nullable: true })
  attachments: string[];

  @ApiProperty({ example: ['123123123'] })
  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
