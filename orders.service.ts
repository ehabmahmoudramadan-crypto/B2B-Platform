import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Offer } from './offer.entity';
import { OrderStatus, PaymentStatus } from '../common/enums';
import { CreateOrderDto, SubmitOfferDto, AcceptOfferDto } from './orders.dto';
import { WalletService } from '../wallet/wallet.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CashbackService } from '../cashback/cashback.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
    private cashbackService: CashbackService,
  ) {}

  async create(clientId: string, dto: CreateOrderDto) {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const subtotal = dto.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const vatAmount = subtotal * 0.15;
    const total = subtotal + vatAmount + (dto.deliveryFee || 0);

    const order = this.orderRepository.create({
      orderNumber,
      clientId,
      description: dto.description,
      items: dto.items,
      deliveryAddress: dto.deliveryAddress,
      subtotal,
      deliveryFee: dto.deliveryFee || 0,
      vatAmount,
      total,
      status: OrderStatus.AWAITING_OFFERS,
      paymentStatus: PaymentStatus.PENDING,
      expectedDeliveryDate: dto.expectedDeliveryDate,
      isRush: dto.isRush || false,
    });

    await this.orderRepository.save(order);

    await this.notificationsService.sendToRole(
      'supplier',
      'طلب جديد',
      `طلب جديد رقم ${orderNumber} متاح للعروض`,
      { orderId: order.id, type: 'new_order' },
    );

    return order;
  }

  async findAllForClient(clientId: string) {
    return this.orderRepository.find({
      where: { clientId },
      relations: ['offers', 'invoice'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['offers', 'offers.supplier', 'invoice', 'deliveryAssignment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getAvailableOrders() {
    return this.orderRepository.find({
      where: { status: OrderStatus.AWAITING_OFFERS },
      order: { createdAt: 'DESC' },
    });
  }

  async submitOffer(supplierId: string, orderId: string, dto: SubmitOfferDto) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, status: OrderStatus.AWAITING_OFFERS },
    });

    if (!order) {
      throw new NotFoundException('Order not found or not accepting offers');
    }

    const existingOffer = await this.offerRepository.findOne({
      where: { orderId, supplierId },
    });

    if (existingOffer) {
      throw new BadRequestException('You already submitted an offer for this order');
    }

    const grandTotal = dto.totalPrice + dto.deliveryFee + dto.vatAmount;

    const offer = this.offerRepository.create({
      orderId,
      supplierId,
      totalPrice: dto.totalPrice,
      deliveryFee: dto.deliveryFee,
      vatAmount: dto.vatAmount,
      grandTotal,
      estimatedDeliveryDays: dto.estimatedDeliveryDays,
      notes: dto.notes,
      items: dto.items,
    });

    await this.offerRepository.save(offer);

    await this.notificationsService.sendToClient(
      order.clientId,
      'عرض سعر جديد',
      `تم استلام عرض سعر جديد للطلب ${order.orderNumber}`,
      { orderId, offerId: offer.id, type: 'new_offer' },
    );

    return offer;
  }

  async acceptOffer(clientId: string, orderId: string, dto: AcceptOfferDto) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, clientId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.AWAITING_OFFERS) {
      throw new BadRequestException('Order is not awaiting offers');
    }

    const offer = await this.offerRepository.findOne({
      where: { id: dto.offerId, orderId },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    offer.isAccepted = true;
    await this.offerRepository.save(offer);

    order.status = OrderStatus.OFFER_ACCEPTED;
    order.supplierId = offer.supplierId;
    order.total = offer.grandTotal;
    await this.orderRepository.save(order);

    await this.walletService.holdAmount(clientId, order.total, order.id);

    order.status = OrderStatus.CONFIRMED;
    await this.orderRepository.save(order);

    await this.notificationsService.sendToSupplier(
      offer.supplierId,
      'تم قبول العرض',
      `تم قبول عرضك للطلب ${order.orderNumber}`,
      { orderId, offerId: offer.id, type: 'offer_accepted' },
    );

    return order;
  }

  async confirmPartsAvailable(supplierId: string, orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, supplierId, status: OrderStatus.OFFER_ACCEPTED },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.PROCESSING;
    await this.orderRepository.save(order);

    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus, userId: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;

    if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
      const holdEnd = new Date();
      holdEnd.setDate(holdEnd.getDate() + 15);
      order.holdPeriodEnd = holdEnd;
      order.status = OrderStatus.HOLD_PERIOD;
    }

    if (status === OrderStatus.COMPLETED) {
      await this.walletService.releaseAmount(order.clientId, order.total, order.id);
      const cashbackAmount = await this.cashbackService.calculateCashback(order);
      if (cashbackAmount > 0) {
        await this.walletService.addCashback(order.clientId, cashbackAmount, order.id);
        order.cashbackAmount = cashbackAmount;
      }
    }

    if (status === OrderStatus.CANCELLED) {
      await this.walletService.refundAmount(order.clientId, order.total, order.id);
    }

    await this.orderRepository.save(order);
    return order;
  }

  async getOrdersForSupplier(supplierId: string) {
    return this.orderRepository.find({
      where: { supplierId },
      relations: ['client', 'offers'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersForDelivery() {
    return this.orderRepository.find({
      where: { status: OrderStatus.READY_FOR_DELIVERY },
      relations: ['client', 'deliveryAssignment'],
      order: { createdAt: 'DESC' },
    });
  }
}
