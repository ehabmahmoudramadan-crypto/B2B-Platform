import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';
import { NotificationType } from '../common/enums';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectQueue('notifications')
    private notificationQueue: Queue,
  ) {}

  async sendToUser(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>,
    type: NotificationType = NotificationType.IN_APP,
  ) {
    const notification = this.notificationRepository.create({
      userId,
      title,
      body,
      data,
      type,
    });

    await this.notificationRepository.save(notification);

    await this.notificationQueue.add('send', {
      notificationId: notification.id,
      userId,
      title,
      body,
      data,
      type,
    });

    return notification;
  }

  async sendToClient(clientId: string, title: string, body: string, data?: Record<string, any>) {
    return this.sendToUser(clientId, title, body, { ...data, role: 'client' });
  }

  async sendToSupplier(supplierId: string, title: string, body: string, data?: Record<string, any>) {
    return this.sendToUser(supplierId, title, body, { ...data, role: 'supplier' });
  }

  async sendToDelivery(deliveryId: string, title: string, body: string, data?: Record<string, any>) {
    return this.sendToUser(deliveryId, title, body, { ...data, role: 'delivery' });
  }

  async sendToRole(
    role: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ) {
    await this.notificationQueue.add('broadcast', {
      role,
      title,
      body,
      data,
    });
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      unreadCount: await this.notificationRepository.count({
        where: { userId, isRead: false },
      }),
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true, readAt: new Date() },
    );
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }
}
