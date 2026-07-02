import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryAssignment } from './delivery-assignment.entity';
import { DeliveryProfile } from './delivery-profile.entity';
import { Order } from '../orders/order.entity';
import { OrderStatus } from '../common/enums';
import { WalletService } from '../wallet/wallet.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryAssignment)
    private assignmentRepository: Repository<DeliveryAssignment>,
    @InjectRepository(DeliveryProfile)
    private deliveryProfileRepository: Repository<DeliveryProfile>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
  ) {}

  async getAvailableDeliveries() {
    return this.orderRepository.find({
      where: { status: OrderStatus.READY_FOR_DELIVERY },
      relations: ['client', 'deliveryAssignment'],
    });
  }

  async acceptDelivery(deliveryPersonId: string, orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, status: OrderStatus.READY_FOR_DELIVERY },
    });

    if (!order) {
      throw new NotFoundException('Order not available for delivery');
    }

    const existingAssignment = await this.assignmentRepository.findOne({
      where: { orderId },
    });

    if (existingAssignment && existingAssignment.deliveryPersonId !== deliveryPersonId) {
      throw new BadRequestException('Order already assigned to another delivery person');
    }

    let assignment = existingAssignment;

    if (!assignment) {
      assignment = this.assignmentRepository.create({
        orderId,
        deliveryPersonId,
        isAccepted: true,
        acceptedAt: new Date(),
        deliveryFee: order.deliveryFee,
      });
    } else {
      assignment.isAccepted = true;
      assignment.acceptedAt = new Date();
    }

    await this.assignmentRepository.save(assignment);

    order.status = OrderStatus.WITH_DELIVERY;
    await this.orderRepository.save(order);

    return assignment;
  }

  async updateLocation(deliveryPersonId: string, latitude: number, longitude: number) {
    await this.deliveryProfileRepository.update(
      { userId: deliveryPersonId },
      { currentLatitude: latitude, currentLongitude: longitude },
    );
  }

  async updateDeliveryStatus(
    deliveryPersonId: string,
    orderId: string,
    status: string,
    data?: { proofImageUrl?: string; signatureUrl?: string; notes?: string },
  ) {
    const assignment = await this.assignmentRepository.findOne({
      where: { orderId, deliveryPersonId },
    });

    if (!assignment) {
      throw new NotFoundException('Delivery assignment not found');
    }

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (status === 'picked_up') {
      assignment.pickedUpAt = new Date();
      order.status = OrderStatus.WITH_DELIVERY;
    } else if (status === 'delivered') {
      assignment.deliveredAt = new Date();
      assignment.proofImageUrl = data?.proofImageUrl;
      assignment.signatureUrl = data?.signatureUrl;
      assignment.notes = data?.notes;

      order.status = OrderStatus.DELIVERED;
      order.deliveredAt = new Date();

      const holdEnd = new Date();
      holdEnd.setDate(holdEnd.getDate() + 15);
      order.holdPeriodEnd = holdEnd;

      // Credit delivery earnings
      const earnings = order.deliveryFee * 0.85;
      assignment.earnings = earnings;
      await this.walletService.deposit(deliveryPersonId, earnings, `delivery-${orderId}`);
    }

    await this.assignmentRepository.save(assignment);
    await this.orderRepository.save(order);

    return { assignment, order };
  }

  async getDeliveryHistory(deliveryPersonId: string) {
    return this.assignmentRepository.find({
      where: { deliveryPersonId },
      relations: ['order', 'order.client'],
      order: { createdAt: 'DESC' },
    });
  }
}
