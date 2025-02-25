import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_tags' })
export class ProductTags extends BaseEntity {
  @ApiProperty({ example: 'Technology' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToOne(() => Product, (product) => product.tags)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
