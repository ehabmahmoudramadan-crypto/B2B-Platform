import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async findAll() {
    return this.cityRepository.find({ where: { isActive: true } });
  }
}
