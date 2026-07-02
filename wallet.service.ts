import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { WalletTransactionType } from '../common/enums';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private transactionRepository: Repository<WalletTransaction>,
    private dataSource: DataSource,
  ) {}

  async getWallet(userId: string) {
    const wallet = await this.walletRepository.findOne({
      where: { userId },
      relations: ['transactions'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async deposit(userId: string, amount: number, paymentReference?: string) {
    const wallet = await this.getWallet(userId);

    const transaction = this.transactionRepository.create({
      walletId: wallet.id,
      type: WalletTransactionType.DEPOSIT,
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance + amount,
      paymentReference,
      description: `Deposit of ${amount} SAR`,
    });

    wallet.balance += amount;
    wallet.totalDeposited += amount;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(wallet);
      await manager.save(transaction);
    });

    return { wallet, transaction };
  }

  async withdraw(userId: string, amount: number) {
    const wallet = await this.getWallet(userId);

    if (wallet.availableBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction = this.transactionRepository.create({
      walletId: wallet.id,
      type: WalletTransactionType.WITHDRAWAL,
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance - amount,
      description: `Withdrawal of ${amount} SAR`,
    });

    wallet.balance -= amount;
    wallet.totalWithdrawn += amount;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(wallet);
      await manager.save(transaction);
    });

    return { wallet, transaction };
  }

  async holdAmount(userId: string, amount: number, orderId: string) {
    const wallet = await this.getWallet(userId);

    if (wallet.availableBalance < amount) {
      throw new BadRequestException('Insufficient balance to hold');
    }

    const transaction = this.transactionRepository.create({
      walletId: wallet.id,
      type: WalletTransactionType.HOLD,
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance,
      referenceId: orderId,
      referenceType: 'order',
      description: `Hold of ${amount} SAR for order ${orderId}`,
    });

    wallet.heldBalance += amount;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(wallet);
      await manager.save(transaction);
    });

    return { wallet, transaction };
  }

  async releaseAmount(userId: string, amount: number, orderId: string) {
    const wallet = await this.getWallet(userId);

    const transaction = this.transactionRepository.create({
      walletId: wallet.id,
      type: WalletTransactionType.RELEASE,
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance,
      referenceId: orderId,
      referenceType: 'order',
      description: `Release of ${amount} SAR from hold for order ${orderId}`,
    });

    wallet.heldBalance -= amount;
    wallet.balance -= amount;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(wallet);
      await manager.save(transaction);
    });

    return { wallet, transaction };
  }

  async refundAmount(userId: string, amount: number, orderId: string) {
    const wallet = await this.getWallet(userId);

    const transaction = this.transactionRepository.create({
      walletId: wallet.id,
      type: WalletTransactionType.REFUND,
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance,
      referenceId: orderId,
      referenceType: 'order',
      description: `Refund of ${amount} SAR from order ${orderId}`,
    });

    wallet.heldBalance -= amount;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(wallet);
      await manager.save(transaction);
    });

    return { wallet, transaction };
  }

  async addCashback(userId: string, amount: number, orderId: string) {
    const wallet = await this.getWallet(userId);

    const transaction = this.transactionRepository.create({
      walletId: wallet.id,
      type: WalletTransactionType.CASHBACK,
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance + amount,
      referenceId: orderId,
      referenceType: 'order',
      description: `Cashback of ${amount} SAR for order ${orderId}`,
    });

    wallet.balance += amount;
    wallet.cashbackBalance += amount;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(wallet);
      await manager.save(transaction);
    });

    return { wallet, transaction };
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const wallet = await this.getWallet(userId);

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { walletId: wallet.id },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
