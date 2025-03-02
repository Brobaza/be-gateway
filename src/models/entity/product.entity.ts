import { ApiProperty } from '@nestjs/swagger';
import { InventoryType } from 'src/enums/inventory-type.enum';
import { ProductGender } from 'src/enums/product-gender.enum';
import { ProductSocialType } from 'src/enums/product-social-type.enm';
import { BaseEntity } from 'src/libs/base/base.entity';
import { DecimalToNumberTransformer } from 'src/transformer/decimal-to-number.transform';
import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductLabels } from './product_labels.entity';
import { ProductRating } from './product_rating.entity';
import { ProductReviews } from './product_reviews.entity';
import { ProductTags } from './product_tags.entity';
import { ProductVariant } from './product_variant.entity';

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @Index('idx_product_name')
  @ApiProperty({ example: 'iPhone 13' })
  @Column()
  name: string;

  @Index('idx_product_max_price')
  @ApiProperty({ example: 1000 })
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: new DecimalToNumberTransformer(),
  })
  maxPrice: number;

  @Index('idx_product_min_price')
  @ApiProperty({ example: 1000 })
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: new DecimalToNumberTransformer(),
  })
  minPrice: number;

  @ApiProperty({ example: 100 })
  @Column({ type: 'int' })
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

  @ApiProperty({ example: ['red', 'yellow'] })
  @Column({ type: 'varchar', array: true, nullable: true })
  colors: string[];

  @Index('idx_product_inventory_status')
  @ApiProperty({ example: 'IN_STOCK' })
  @Column({
    type: 'enum',
    enum: Object.values(InventoryType),
    default: InventoryType.IN_STOCK,
  })
  inventoryStatus: InventoryType;

  @ApiProperty({ example: 'PUBLIC' })
  @Column({
    type: 'enum',
    enum: Object.values(ProductSocialType),
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

  @ManyToMany(() => ProductTags, (discount) => discount.products)
  tags: ProductTags[];
}
