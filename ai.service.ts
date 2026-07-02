import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { SupplierProfile } from '../supplier/supplier-profile.entity';
import { SparePart } from '../spare-parts/spare-part.entity';
import { OrderStatus } from '../common/enums';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(SupplierProfile)
    private supplierProfileRepository: Repository<SupplierProfile>,
    @InjectRepository(SparePart)
    private sparePartRepository: Repository<SparePart>,
  ) {}

  async suggestBestSupplier(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) return null;

    const suppliers = await this.supplierProfileRepository.find({
      where: { isActive: true, isVerified: true },
    });

    const scored = suppliers
      .map((s) => ({
        supplier: s,
        score: this.calculateSupplierScore(s, order),
      }))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 5);
  }

  async analyzePrices(sparePartId: string) {
    const part = await this.sparePartRepository.findOne({
      where: { id: sparePartId },
    });

    if (!part) return null;

    const completedOrders = await this.orderRepository.find({
      where: { status: OrderStatus.COMPLETED },
    });

    const prices = completedOrders
      .filter((o) => o.items?.some((i) => i.sparePartId === sparePartId))
      .map((o) => {
        const item = o.items.find((i) => i.sparePartId === sparePartId);
        return item ? item.unitPrice : 0;
      })
      .filter((p) => p > 0);

    const avgPrice = prices.length > 0
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : part.estimatedPrice || 0;

    return {
      sparePart: part.name,
      estimatedPrice: part.estimatedPrice,
      averageMarketPrice: avgPrice,
      priceRange: {
        min: Math.min(...prices, part.estimatedPrice || 0),
        max: Math.max(...prices, part.estimatedPrice || 0),
      },
      isAnomaly: this.detectAnomaly(prices, part.estimatedPrice || 0),
    };
  }

  async suggestAlternatives(sparePartId: string) {
    const part = await this.sparePartRepository.findOne({
      where: { id: sparePartId },
      relations: ['category', 'brand'],
    });

    if (!part) return [];

    const alternatives = await this.sparePartRepository.find({
      where: {
        categoryId: part.categoryId,
        isActive: true,
      },
      take: 5,
    });

    return alternatives.filter((a) => a.id !== part.id);
  }

  async predictDeliveryTime(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) return null;

    const completedOrders = await this.orderRepository.find({
      where: { status: OrderStatus.COMPLETED },
    });

    const avgDeliveryTime = completedOrders.length > 0
      ? completedOrders.reduce((sum, o) => {
          if (o.deliveredAt && o.createdAt) {
            const diff = o.deliveredAt.getTime() - o.createdAt.getTime();
            return sum + diff / (1000 * 60 * 60 * 24);
          }
          return sum;
        }, 0) / completedOrders.length
      : 3;

    return {
      predictedDays: Math.ceil(avgDeliveryTime),
      confidence: completedOrders.length > 10 ? 'high' : 'medium',
    };
  }

  private calculateSupplierScore(supplier: SupplierProfile, order: Order): number {
    let score = 0;

    score += supplier.rating * 20;

    score += (supplier.completedOrders / (supplier.totalOrders || 1)) * 30;

    const categoryMatch = order.items?.some((item) =>
      supplier.categories?.includes(item.category || ''),
    );
    if (categoryMatch) score += 25;

    score += Math.min(supplier.totalOrders, 100) * 0.25;

    return Math.min(score, 100);
  }

  private detectAnomaly(prices: number[], estimated: number): boolean {
    if (prices.length < 3) return false;
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const stdDev = Math.sqrt(
      prices.reduce((sq, p) => sq + Math.pow(p - mean, 2), 0) / prices.length,
    );
    return Math.abs(estimated - mean) > 2 * stdDev;
  }
}
