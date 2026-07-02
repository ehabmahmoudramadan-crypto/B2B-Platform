import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { InvoiceStatus } from '../common/enums';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @Column({ unique: true })
  invoiceNumber: string;

  @OneToOne(() => Order, (order) => order.invoice)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'supplier_id' })
  supplier: User;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  vatAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  vatRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cashbackAmount: number;

  @Column({ type: 'text', nullable: true })
  qrCode: string;

  @Column({ type: 'text', nullable: true })
  xmlContent: string;

  @Column({ nullable: true })
  zatcaInvoiceId: string;

  @Column({ nullable: true })
  zatcaStatus: string;

  @Column({ type: 'json', nullable: true })
  zatcaResponse: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  issuedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  pdfUrl: string;

  @Column({ default: false })
  isPlatformInvoice: boolean;
}
