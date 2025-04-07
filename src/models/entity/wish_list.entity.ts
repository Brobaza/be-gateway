import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'user_wish_list' })
export class WishList extends BaseEntity {
  @ApiProperty({ example: '' })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => Product, (product) => product.wish_list)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
