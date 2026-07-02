import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('cities')
export class City extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, nullable: true })
  nameAr: string;

  @Column({ length: 10 })
  countryCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ default: true })
  isActive: boolean;
}
