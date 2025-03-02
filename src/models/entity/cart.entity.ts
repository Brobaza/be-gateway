import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from './product_variant.entity';
import { BaseEntity } from 'src/libs/base/base.entity';

@Entity({ name: 'cart' })
export class Cart extends BaseEntity {
  @ApiProperty({ example: 1 })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int' })
  pricePerEach: number;

  @ApiProperty({ example: '' })
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.carts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productVariantId' })
  product: ProductVariant;

  @ApiProperty({ type: () => [Order] })
  @ManyToOne(() => Order, (order) => order.carts)
  @JoinColumn({ name: 'orderId' })
  orders: Order;
}
