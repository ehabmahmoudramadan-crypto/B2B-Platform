import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';

@Entity('delivery_profiles')
export class DeliveryProfile extends BaseEntity {
  @OneToOne(() => User, (user) => user.deliveryProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLongitude: number;

  @Column({ nullable: true })
  vehicleType: string;

  @Column({ nullable: true })
  vehiclePlate: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalDeliveries: number;

  @Column({ default: 0 })
  completedDeliveries: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'simple-json', nullable: true })
  serviceAreas: string[];
}
