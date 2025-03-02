import { ApiProperty } from '@nestjs/swagger';
import { DiscountType } from 'src/enums/discount-type.enum';
import { BaseEntity } from 'src/libs/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'discount' })
export class Discount extends BaseEntity {
  @ApiProperty({ example: '10' })
  @Column({ type: 'int', nullable: true })
  discountPrice: number;

  @ApiProperty({ example: '10' })
  @Column({ type: 'int', nullable: true })
  discountPercentage: number;

  @ApiProperty({ example: DiscountType.PERCENTAGE })
  @Column({
    type: 'enum',
    enum: Object.values(DiscountType),
    default: DiscountType.PERCENTAGE,
  })
  type: DiscountType;

  @ApiProperty({ example: 'abc-xyz' })
  @Column({ unique: true, nullable: false })
  code: string;

  @ApiProperty({ example: '2022-12-31' })
  @Column({ type: 'date' })
  tillDate: Date;

  @ApiProperty({ example: '2022-12-31' })
  @Column({ type: 'date' })
  fromDate: Date;

  @ApiProperty({ example: 100000 })
  @Column({ type: 'int', nullable: true })
  minOrderValue: number;

  @ApiProperty({ example: 100 })
  @Column({ type: 'int', nullable: true })
  usageLimit: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', nullable: true })
  maxUsagePerUser: number;

  @ApiProperty({ example: ['product1', 'product2'] })
  @Column({ type: 'varchar', array: true, nullable: true })
  applicableProducts: string[];

  @ApiProperty({ example: ['category1', 'category2'] })
  @Column({ type: 'varchar', array: true, nullable: true })
  applicableCategories: string[];

  @ManyToOne(() => Order, (order) => order.discount)
  orders: Order[];
}
