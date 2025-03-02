import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_tags' })
export class ProductTags extends BaseEntity {
  @ApiProperty({ example: 'Technology' })
  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Product, (product) => product.tags)
  @JoinTable({
    name: 'product_tags_and_product',
    joinColumn: { name: 'product_tag_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];
}
