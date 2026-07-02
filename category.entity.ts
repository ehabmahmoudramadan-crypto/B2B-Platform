import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  parentId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;
}
