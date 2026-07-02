import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';
import { WalletTransaction } from './wallet-transaction.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  heldBalance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDeposited: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalWithdrawn: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cashbackBalance: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => WalletTransaction, (txn) => txn.wallet)
  transactions: WalletTransaction[];

  get availableBalance(): number {
    return this.balance - this.heldBalance;
  }
}
