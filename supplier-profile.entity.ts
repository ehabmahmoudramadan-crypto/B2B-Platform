import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';

@Entity('supplier_profiles')
export class SupplierProfile extends BaseEntity {
  @OneToOne(() => User, (user) => user.supplierProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 200 })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  categories: string[];

  @Column({ type: 'simple-json', nullable: true })
  brands: string[];

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  locationAddress: string;

  @Column({ nullable: true })
  cityId: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'simple-json', nullable: true })
  workingHours: {
    day: string;
    open: string;
    close: string;
    isOff: boolean;
  }[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalOrders: number;

  @Column({ default: 0 })
  completedOrders: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  commissionRate: number;
}
