import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierProfile } from './supplier-profile.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierProfile)
    private supplierProfileRepository: Repository<SupplierProfile>,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.supplierProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) throw new NotFoundException('Supplier profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: Partial<SupplierProfile>) {
    const profile = await this.getProfile(userId);
    Object.assign(profile, dto);
    return this.supplierProfileRepository.save(profile);
  }

  async getAllSuppliers() {
    return this.supplierProfileRepository.find({
      where: { isActive: true },
      relations: ['user'],
    });
  }

  async getNearbySuppliers(latitude: number, longitude: number, radiusKm = 50) {
    const suppliers = await this.supplierProfileRepository.find({
      where: { isActive: true, isVerified: true },
    });

    return suppliers.filter((s) => {
      if (!s.latitude || !s.longitude) return false;
      const distance = this.calculateDistance(
        latitude, longitude, s.latitude, s.longitude,
      );
      return distance <= radiusKm;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}
