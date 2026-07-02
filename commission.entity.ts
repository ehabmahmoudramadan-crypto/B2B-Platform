import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('commissions')
export class Commission extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rate: number;

  @Column({ length: 20 })
  type: string;

  @Column({ nullable: true })
  supplierId: string;

  @Column({ default: true })
  isActive: boolean;
}
