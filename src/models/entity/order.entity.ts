import { ApiProperty } from '@nestjs/swagger';
import { extend } from 'lodash';
import { BaseEntity } from 'src/libs/base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { DeliveryCenter } from './delivery_center.entity';
import { Cart } from './cart.entity';
import { Discount } from './discount.entity';
import { DeliveryHistory } from './delivery_history.entity';

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @ApiProperty({ example: '1' })
  @Column({ type: 'uuid' })
  addressId: string;

  @ApiProperty({ example: '1' })
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => DeliveryCenter, (deliveryCenter) => deliveryCenter.orders)
  @JoinColumn({ name: 'deliveryCenterId' })
  deliveryCenter: DeliveryCenter;

  // @ApiProperty({ type: () => [Cart] })
  // @ManyToMany(() => Cart, (cart) => cart.orders)
  // @JoinTable({
  //   name: 'order_from_cart',
  //   joinColumn: { name: 'orderId', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'cartId', referencedColumnName: 'id' },
  // })
  // carts: Cart[];
  @ApiProperty({ type: () => [Cart] })
  @OneToMany(() => Cart, (cart) => cart.orders)
  carts: Cart[];

  @ApiProperty({ type: () => [DeliveryHistory] })
  @OneToMany(() => DeliveryHistory, (deliveryHistory) => deliveryHistory.order)
  deliveryHistories: DeliveryHistory[];

  @ApiProperty({ example: '10000' })
  @Column({ type: 'int' })
  shippingFee: number;

  @ApiProperty({ example: '10000' })
  @Column({ type: 'int' })
  discountValue: number;

  @ApiProperty({ example: '10000' })
  @Column({ type: 'int' })
  tax: number;

  @OneToMany(() => Discount, (discount) => discount.orders)
  @JoinColumn({ name: 'discountId' })
  discount: Discount;

  @ApiProperty({ example: '10000' })
  @Column({ type: 'int' })
  total: number;
}
