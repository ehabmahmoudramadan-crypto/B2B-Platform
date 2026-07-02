import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('cashback_rules')
export class CashbackRule extends BaseEntity {
  @Column()
  name: string;

  @Column({ length: 20 })
  type: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxCashback: number;

  @Column({ default: true })
  isActive: boolean;
}
