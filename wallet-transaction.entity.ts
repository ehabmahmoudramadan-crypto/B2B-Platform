import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Wallet } from './wallet.entity';
import { WalletTransactionType } from '../common/enums';

@Entity('wallet_transactions')
export class WalletTransaction extends BaseEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column({ name: 'wallet_id' })
  walletId: string;

  @Column({ type: 'enum', enum: WalletTransactionType })
  type: WalletTransactionType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  fee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  balanceBefore: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  balanceAfter: number;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ nullable: true })
  referenceType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  paymentReference: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
