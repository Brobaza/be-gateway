import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/libs/base/base.entity';
import { DecimalToNumberTransformer } from 'src/transformer/decimal-to-number.transform';
import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { InventoryType } from 'src/enums/inventory-type.enum';
import { ProductSocialType } from 'src/enums/product-social-type.enm';
import { ProductRating } from './product_rating.entity';
import { ProductVariant } from './product_variant.entity';
import { ProductGender } from 'src/enums/product-gender.enum';
import { ProductReviews } from './product_reviews.entity';
import { ProductLabels } from './product_labels.entity';
import { ProductTags } from './product_tags.entity';

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @Index('idx_product_name')
  @ApiProperty({ example: 'iPhone 13' })
  @Column()
  name: string;

  @Index('idx_product_price')
  @ApiProperty({ example: 1000 })
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: new DecimalToNumberTransformer(),
  })
  price: number;

  @Index('idx_product_sale_price')
  @ApiProperty({ example: 1000 })
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: new DecimalToNumberTransformer(),
  })
  salePrice: number;

  @ApiProperty({ example: 100 })
  @Column()
  quantity: number;

  @Index('idx_product_slug')
  @ApiProperty({ example: 'slug' })
  @Column({ type: 'text', nullable: true, unique: true })
  slug: string;

  @ApiProperty({ example: ['https://example.com/product.jpg'] })
  @Column({ type: 'varchar', array: true, nullable: true })
  images: string[];

  @ApiProperty({ example: 'https://example.com/product.jpg' })
  @Column({ nullable: false, type: 'varchar' })
  cover: string;

  @ApiProperty({ example: ['kids'] })
  @Column({ type: 'varchar', array: true, nullable: true })
  genders: ProductGender[];

  @ApiProperty({ example: ['7', '́'] })
  @Column({ type: 'varchar', array: true, nullable: true })
  sizes: string[];

  @Index('idx_product_inventory_status')
  @ApiProperty({ example: 'IN_STOCK' })
  @Column({
    type: 'enum',
    enum: InventoryType,
    default: InventoryType.IN_STOCK,
  })
  inventoryStatus: InventoryType;

  @ApiProperty({ example: 'PUBLIC' })
  @Column({
    type: 'enum',
    enum: ProductSocialType,
    default: ProductSocialType.PUBLIC,
  })
  socialType: string;

  @ApiProperty({ example: 'The best product ever' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 'The best product ever' })
  @Column({ type: 'text', nullable: true })
  subDescription: string;

  @Index('idx_product_category')
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Index('idx_product_total_rating')
  @ApiProperty({ example: 1 })
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: new DecimalToNumberTransformer(),
  })
  @Check(`"totalRating" >= 0 AND "totalRating" <= 5`)
  totalRating: number;

  @ApiProperty({ example: 100 })
  @Column({ nullable: true, default: 100 })
  totalReview: number;

  @ApiProperty({ example: 100 })
  @Column({ nullable: true, default: 100, type: 'int' })
  @Check(`"totalSold" >= 0 AND "totalSold" <= "quantity"`)
  totalSold: number;

  @OneToMany(() => ProductRating, (rating) => rating.product)
  ratings: ProductRating[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductReviews, (review) => review.product)
  reviews: ProductReviews[];

  @OneToMany(() => ProductLabels, (label) => label.product)
  labels: ProductLabels[];

  @OneToMany(() => ProductTags, (tag) => tag.product)
  tags: ProductTags[];
}
