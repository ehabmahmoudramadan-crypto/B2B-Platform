import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('brands')
export class Brand extends BaseEntity {
  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: true })
  isActive: boolean;
}
