import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_variant' })
export class ProductVariant extends BaseEntity {
  @ApiProperty({ example: '#000000' })
  @Column({ nullable: true, type: 'varchar' })
  color: string;

  @ApiProperty({ example: '64GB' })
  @Column({ nullable: true, type: 'varchar' })
  storage: string;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
