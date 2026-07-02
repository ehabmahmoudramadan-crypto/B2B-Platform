import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { OrderStatus, PaymentStatus } from '../common/enums';
import { User } from '../users/user.entity';
import { Offer } from './offer.entity';
import { Invoice } from '../invoices/invoice.entity';
import { DeliveryAssignment } from '../delivery/delivery-assignment.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ unique: true })
  orderNumber: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ nullable: true })
  supplierId: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-json' })
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  vatAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cashbackAmount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'simple-json', nullable: true })
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
    notes: string;
  };

  @Column({ type: 'timestamp', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  holdPeriodEnd: Date;

  @Column({ nullable: true })
  cancellationReason: string;

  @Column({ type: 'simple-json', nullable: true })
  location: {
    latitude: number;
    longitude: number;
  };

  @Column({ default: false })
  isRush: boolean;

  @OneToMany(() => Offer, (offer) => offer.order)
  offers: Offer[];

  @OneToOne(() => Invoice, (invoice) => invoice.order)
  invoice: Invoice;

  @OneToOne(() => DeliveryAssignment, (assignment) => assignment.order)
  deliveryAssignment: DeliveryAssignment;
}

export interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sparePartId?: string;
  brand?: string;
  category?: string;
  image?: string;
}
