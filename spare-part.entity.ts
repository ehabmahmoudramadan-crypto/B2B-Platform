import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Category } from '../categories/category.entity';
import { Brand } from '../brands/brand.entity';

@Entity('spare_parts')
export class SparePart extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 100 })
  sku: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'brand_id' })
  brandId: string;

  @Column({ type: 'simple-json', nullable: true })
  compatibleModels: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedPrice: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  specifications: Record<string, any>;
}
