import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierProfile } from '../supplier/supplier-profile.entity';
import { DeliveryProfile } from '../delivery/delivery-profile.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MapsService {
  constructor(
    @InjectRepository(SupplierProfile)
    private supplierRepository: Repository<SupplierProfile>,
    @InjectRepository(DeliveryProfile)
    private deliveryRepository: Repository<DeliveryProfile>,
    private configService: ConfigService,
  ) {}

  async getSuppliersOnMap(cityId?: string) {
    const where: any = { isActive: true, isVerified: true };
    if (cityId) where.cityId = cityId;

    const suppliers = await this.supplierRepository.find({
      where,
      relations: ['user'],
    });

    return suppliers
      .filter((s) => s.latitude && s.longitude)
      .map((s) => ({
        id: s.userId,
        name: s.companyName,
        latitude: s.latitude,
        longitude: s.longitude,
        address: s.locationAddress,
        rating: s.rating,
        categories: s.categories,
        logo: s.logo,
      }));
  }

  async getDeliveryLocations() {
    const delivery = await this.deliveryRepository.find({
      where: { isAvailable: true },
      relations: ['user'],
    });

    return delivery
      .filter((d) => d.currentLatitude && d.currentLongitude)
      .map((d) => ({
        id: d.userId,
        name: d.user?.fullName,
        latitude: d.currentLatitude,
        longitude: d.currentLongitude,
        rating: d.rating,
      }));
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  estimateDeliveryFee(distanceKm: number): number {
    const baseFee = 15;
    const perKmRate = 2;
    return baseFee + distanceKm * perKmRate;
  }

  estimateArrivalTime(distanceKm: number): number {
    const avgSpeed = 40;
    return Math.ceil((distanceKm / avgSpeed) * 60);
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}
