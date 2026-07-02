import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

@Entity('delivery_assignments')
export class DeliveryAssignment extends BaseEntity {
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'delivery_id' })
  deliveryPerson: User;

  @Column({ name: 'delivery_id' })
  deliveryPersonId: string;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ nullable: true })
  acceptedAt: Date;

  @Column({ nullable: true })
  pickedUpAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  pickupLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  pickupLongitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  deliveryLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  deliveryLongitude: number;

  @Column({ nullable: true })
  proofImageUrl: string;

  @Column({ nullable: true })
  signatureUrl: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  earnings: number;
}
