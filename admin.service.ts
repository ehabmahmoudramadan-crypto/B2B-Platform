import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { Wallet } from '../wallet/wallet.entity';
import { Invoice } from '../invoices/invoice.entity';
import { Dispute } from '../disputes/dispute.entity';
import { Category } from '../categories/category.entity';
import { Brand } from '../brands/brand.entity';
import { SparePart } from '../spare-parts/spare-part.entity';
import { City } from '../cities/city.entity';
import { SupplierProfile } from '../supplier/supplier-profile.entity';
import { DeliveryProfile } from '../delivery/delivery-profile.entity';
import { Notification } from '../notifications/notification.entity';
import { AuditLog } from '../audit-log/audit-log.entity';
import { UserRole, UserStatus, OrderStatus } from '../common/enums';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Dispute) private disputeRepository: Repository<Dispute>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(SparePart) private sparePartRepository: Repository<SparePart>,
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectRepository(SupplierProfile) private supplierProfileRepository: Repository<SupplierProfile>,
    @InjectRepository(DeliveryProfile) private deliveryProfileRepository: Repository<DeliveryProfile>,
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
    @InjectRepository(AuditLog) private auditLogRepository: Repository<AuditLog>,
    private notificationsService: NotificationsService,
  ) {}

  async getDashboard() {
    const [
      totalUsers, totalClients, totalSuppliers, totalDelivery,
      totalOrders, pendingOrders, completedOrders,
      totalRevenue, totalDisputes,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: UserRole.CLIENT } }),
      this.userRepository.count({ where: { role: UserRole.SUPPLIER } }),
      this.userRepository.count({ where: { role: UserRole.DELIVERY } }),
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.orderRepository.count({ where: { status: OrderStatus.COMPLETED } }),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'total')
        .where('order.status = :status', { status: OrderStatus.COMPLETED })
        .getRawOne(),
      this.disputeRepository.count({ where: { status: 'open' } }),
    ]);

    return {
      totalUsers,
      totalClients,
      totalSuppliers,
      totalDelivery,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue?.total || 0,
      totalDisputes,
    };
  }

  async getUsers(role?: string, page = 1, limit = 20) {
    const where: any = {};
    if (role) where.role = role;

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    await this.userRepository.update(userId, { status });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getOrders(status?: string, page = 1, limit = 20) {
    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['client', 'offers'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  }

  async createCategory(dto: { name: string; description?: string; image?: string; parentId?: string }) {
    const existing = await this.categoryRepository.findOne({ where: { name: dto.name } });
    if (existing) throw new BadRequestException('Category already exists');

    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async createBrand(dto: { name: string; logo?: string }) {
    const existing = await this.brandRepository.findOne({ where: { name: dto.name } });
    if (existing) throw new BadRequestException('Brand already exists');

    const brand = this.brandRepository.create(dto);
    return this.brandRepository.save(brand);
  }

  async createCity(dto: { name: string; nameAr?: string; countryCode: string; latitude?: number; longitude?: number }) {
    const city = this.cityRepository.create(dto);
    return this.cityRepository.save(city);
  }

  async getDisputes(page = 1, limit = 20) {
    const [disputes, total] = await this.disputeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { disputes, total, page, totalPages: Math.ceil(total / limit) };
  }

  async resolveDispute(disputeId: string, resolution: string) {
    await this.disputeRepository.update(disputeId, {
      status: 'resolved' as any,
      resolution,
      resolvedAt: new Date(),
    });
    return this.disputeRepository.findOne({ where: { id: disputeId } });
  }

  async sendNotificationToAll(title: string, body: string, role?: string) {
    if (role) {
      await this.notificationsService.sendToRole(role, title, body);
    } else {
      for (const r of ['client', 'supplier', 'delivery']) {
        await this.notificationsService.sendToRole(r, title, body);
      }
    }
    return { message: 'Notification sent' };
  }

  async getAuditLogs(page = 1, limit = 50) {
    const [logs, total] = await this.auditLogRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { logs, total, page, totalPages: Math.ceil(total / limit) };
  }
}
