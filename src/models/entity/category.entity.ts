import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Product } from './product.entity';

@Tree('closure-table')
@Entity({ name: 'category' })
export class Category extends BaseEntity {
  @Index('idx_category_name')
  @ApiProperty({ example: 'Smartphone' })
  @Column({ unique: true, nullable: false })
  name: string;

  @Index('idx_category_slug')
  @ApiProperty({ example: 'smartphone' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ example: 'https://example.com/smartphone.jpg' })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ example: 'The best smartphones in the world' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @TreeParent({ onDelete: 'SET NULL' })
  parent: Category;

  @TreeChildren()
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
