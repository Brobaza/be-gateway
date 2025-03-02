import { BaseEntity } from 'src/libs/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Notification } from './notification.entity';

@Entity()
export class OrderNotification extends BaseEntity {
  @ManyToOne(() => Notification, { onDelete: 'CASCADE' })
  notification: Notification;

  @Column()
  orderId: number;

  @Column()
  status: string;

  @Column({ type: 'text', nullable: true })
  message: string;
}
