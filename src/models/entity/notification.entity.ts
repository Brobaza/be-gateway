import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from 'src/enums/notification-type.enum';
import { BaseEntity } from 'src/libs/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @ApiProperty({ example: 1 })
  @Column({ nullable: false, type: 'uuid' })
  receiverId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ nullable: true, type: 'uuid' })
  relatedId: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isArchived: boolean;
}
