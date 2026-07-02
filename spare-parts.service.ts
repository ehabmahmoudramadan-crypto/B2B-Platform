import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SparePart } from './spare-part.entity';

@Injectable()
export class SparePartsService {
  constructor(
    @InjectRepository(SparePart)
    private sparePartRepository: Repository<SparePart>,
  ) {}

  async findAll(categoryId?: string, brandId?: string, search?: string) {
    const query = this.sparePartRepository.createQueryBuilder('sp')
      .leftJoinAndSelect('sp.category', 'category')
      .leftJoinAndSelect('sp.brand', 'brand')
      .where('sp.isActive = :active', { active: true });

    if (categoryId) query.andWhere('sp.categoryId = :categoryId', { categoryId });
    if (brandId) query.andWhere('sp.brandId = :brandId', { brandId });
    if (search) query.andWhere('sp.name ILIKE :search OR sp.sku ILIKE :search', { search: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string) {
    return this.sparePartRepository.findOne({
      where: { id },
      relations: ['category', 'brand'],
    });
  }
}
