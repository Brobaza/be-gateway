import { ApiProperty } from '@nestjs/swagger';
import { DeliveryType } from 'src/enums/delivery-type.enum';
import { BaseEntity } from 'src/libs/base/base.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { DeliveryHistory } from './delivery_history.entity';

@Entity({ name: 'delivery_center' })
export class DeliveryCenter extends BaseEntity {
  @Index('idx_delivery_center_name')
  @ApiProperty({ example: 'Delivery Center 1' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'HNI1' })
  @Column({ type: 'text', nullable: true, unique: true })
  code: string;

  @ApiProperty({ example: DeliveryType.REGULAR })
  @Column({
    type: 'enum',
    enum: Object.values(DeliveryType),
    default: DeliveryType.REGULAR,
  })
  type: DeliveryType;

  @ApiProperty({ type: () => Order })
  @ManyToOne(() => Order, (order) => order.deliveryCenter)
  orders: Order;

  @ApiProperty({ type: () => [DeliveryHistory] })
  @OneToMany(
    () => DeliveryHistory,
    (deliveryHistory) => deliveryHistory.deliveryCenter,
  )
  deliveryHistories: DeliveryHistory[];
}
