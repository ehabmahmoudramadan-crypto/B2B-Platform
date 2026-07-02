import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { Invoice } from '../invoices/invoice.entity';
import { WalletTransaction } from '../wallet/wallet-transaction.entity';
import { OrderStatus, UserRole } from '../common/enums';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    @InjectRepository(WalletTransaction) private transactionRepository: Repository<WalletTransaction>,
  ) {}

  async getFinancialReport(startDate?: string, endDate?: string) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .select([
        'SUM(order.total) as total_revenue',
        'SUM(order.vatAmount) as total_vat',
        'SUM(order.deliveryFee) as total_delivery_fees',
        'SUM(order.cashbackAmount) as total_cashback',
        'COUNT(order.id) as total_orders',
      ]);

    if (startDate) query.andWhere('order.createdAt >= :startDate', { startDate });
    if (endDate) query.andWhere('order.createdAt <= :endDate', { endDate });

    return query.getRawOne();
  }

  async getSalesReport(startDate?: string, endDate?: string) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .select([
        "DATE_TRUNC('day', order.createdAt) as date",
        'COUNT(order.id) as orders_count',
        'SUM(order.total) as revenue',
      ])
      .where('order.status = :status', { status: OrderStatus.COMPLETED })
      .groupBy('DATE_TRUNC(\'day\', order.createdAt)')
      .orderBy('date', 'DESC')
      .limit(30);

    if (startDate) query.andWhere('order.createdAt >= :startDate', { startDate });
    if (endDate) query.andWhere('order.createdAt <= :endDate', { endDate });

    return query.getRawMany();
  }

  async getSupplierReport(supplierId?: string) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .select([
        'order.supplierId',
        'COUNT(order.id) as total_orders',
        'SUM(order.total) as total_revenue',
        'AVG(order.total) as avg_order_value',
      ]);

    if (supplierId) {
      query.where('order.supplierId = :supplierId', { supplierId });
    }

    query.groupBy('order.supplierId');

    return query.getRawMany();
  }

  async getClientReport(clientId?: string) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .select([
        'order.clientId',
        'COUNT(order.id) as total_orders',
        'SUM(order.total) as total_spent',
        'AVG(order.total) as avg_order_value',
      ]);

    if (clientId) {
      query.where('order.clientId = :clientId', { clientId });
    }

    query.groupBy('order.clientId');

    return query.getRawMany();
  }

  async getWalletReport() {
    const deposits = await this.transactionRepository
      .createQueryBuilder('tx')
      .select('SUM(tx.amount)', 'total')
      .where("tx.type = 'deposit'")
      .getRawOne();

    const withdrawals = await this.transactionRepository
      .createQueryBuilder('tx')
      .select('SUM(tx.amount)', 'total')
      .where("tx.type = 'withdrawal'")
      .getRawOne();

    return {
      totalDeposits: deposits?.total || 0,
      totalWithdrawals: withdrawals?.total || 0,
    };
  }

  async getPerformanceReport() {
    const orders = await this.orderRepository.find();

    const completed = orders.filter((o) => o.status === OrderStatus.COMPLETED);
    const cancelled = orders.filter((o) => o.status === OrderStatus.CANCELLED);

    const avgCompletionTime = completed.length > 0
      ? completed.reduce((sum, o) => {
          if (o.deliveredAt && o.createdAt) {
            return sum + (o.deliveredAt.getTime() - o.createdAt.getTime());
          }
          return sum;
        }, 0) / (completed.length * 1000 * 60 * 60 * 24)
      : 0;

    return {
      totalOrders: orders.length,
      completedOrders: completed.length,
      cancelledOrders: cancelled.length,
      completionRate: orders.length > 0 ? (completed.length / orders.length) * 100 : 0,
      cancellationRate: orders.length > 0 ? (cancelled.length / orders.length) * 100 : 0,
      averageCompletionDays: Math.round(avgCompletionTime * 10) / 10,
    };
  }
}
