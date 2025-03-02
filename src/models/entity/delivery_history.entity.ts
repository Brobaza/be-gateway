import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DeliveryCenter } from './delivery_center.entity';
import { Order } from './order.entity';

@Entity({ name: 'delivery_history' })
export class DeliveryHistory extends BaseEntity {
  @ApiProperty({ type: () => Order })
  @ManyToOne(() => Order, (order) => order.deliveryHistories)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty({ type: () => DeliveryCenter })
  @ManyToOne(
    () => DeliveryCenter,
    (deliveryCenter) => deliveryCenter.deliveryHistories,
  )
  @JoinColumn({ name: 'deliveryCenterId' })
  deliveryCenter: DeliveryCenter;

  @ApiProperty({ example: 'Order has been created successfully' })
  @Column({ type: 'text' })
  message: string;
}
