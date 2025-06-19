import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from 'src/domain/delivery/delivery.entity';
import { DeliveryRepository } from 'src/domain/delivery/delivery.repository';

@Injectable()
export class TypeOrmDeliveryRepository implements DeliveryRepository {
  constructor(
    @InjectRepository(Delivery)
    private readonly repository: Repository<Delivery>,
  ) {}

  async save(delivery: Delivery): Promise<Delivery> {
    return this.repository.save(delivery);
  }
}
