import { Entity, Column, Index, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { UserRole, UserStatus } from '../common/enums';
import { Order } from '../orders/order.entity';
import { Wallet } from '../wallet/wallet.entity';
import { SupplierProfile } from '../supplier/supplier-profile.entity';
import { DeliveryProfile } from '../delivery/delivery-profile.entity';
import { Notification } from '../notifications/notification.entity';
import { Review } from '../common/review.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100 })
  fullName: string;

  @Index({ unique: true })
  @Column({ length: 100 })
  email: string;

  @Column({ select: false })
  password: string;

  @Index({ unique: true })
  @Column({ length: 20 })
  phone: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  nationalId: string;

  @Column({ nullable: true })
  commercialRegister: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: false })
  isMfaEnabled: boolean;

  @Column({ nullable: true })
  mfaSecret: string;

  @Column({ type: 'simple-json', nullable: true })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'simple-json', nullable: true })
  deviceTokens: string[];

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @OneToOne(() => SupplierProfile, (profile) => profile.user)
  supplierProfile: SupplierProfile;

  @OneToOne(() => DeliveryProfile, (profile) => profile.user)
  deliveryProfile: DeliveryProfile;

  @OneToMany(() => Order, (order) => order.client)
  orders: Order[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
