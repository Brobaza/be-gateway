import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import { DecimalToNumberTransformer } from 'src/transformer/decimal-to-number.transform';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { Cart } from './cart.entity';

@Entity({ name: 'product_variant' })
export class ProductVariant extends BaseEntity {
  @ApiProperty({ example: 'Red' })
  @Column({ type: 'text' })
  title: string;

  @ApiProperty({ example: 1000 })
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: new DecimalToNumberTransformer(),
  })
  price: number;

  @ApiProperty({ example: 1000 })
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: new DecimalToNumberTransformer(),
  })
  salePrice: number;

  @ApiProperty({ example: 100 })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ example: 0 })
  @Column({ type: 'int', nullable: false, default: 0 })
  sold: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];
}
