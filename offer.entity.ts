import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';
import { Order } from './order.entity';

@Entity('offers')
export class Offer extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.offers)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'supplier_id' })
  supplier: User;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  vatAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  grandTotal: number;

  @Column({ type: 'int', default: 3 })
  estimatedDeliveryDays: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-json', nullable: true })
  items: OfferItem[];

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ nullable: true })
  rejectedReason: string;

  @Column({ default: false })
  isPartsAvailable: boolean;
}

export interface OfferItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isAvailable: boolean;
  alternative?: string;
}
