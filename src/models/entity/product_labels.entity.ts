import { ApiProperty } from '@nestjs/swagger';
import { ProductLabelTypes } from 'src/enums/product_labels.enums';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntity } from 'src/libs/base/base.entity';

@Entity({ name: 'product_labels' })
export class ProductLabels extends BaseEntity {
  @ApiProperty({ example: 'New' })
  @Column({
    type: 'enum',
    enum: ProductLabelTypes,
    default: ProductLabelTypes.New,
  })
  type: ProductLabelTypes;

  @ApiProperty({ example: '#000000' })
  @Column({ nullable: true, type: 'varchar' })
  color: string;

  @ApiProperty({ example: 'SALE' })
  @Column({ nullable: true, type: 'varchar' })
  content: string;

  @ManyToOne(() => Product, (product) => product.labels)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
