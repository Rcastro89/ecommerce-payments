import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../../domain/client/client.entity';
import { ClientRepository } from '../../../domain/client/client.repository';

@Injectable()
export class TypeOrmClientRepository implements ClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
  ) {}

  async save(client: Client): Promise<Client> {
    return this.repository.save(client);
  }

  async findById(id: number): Promise<Client | null> {
    return this.repository.findOne({ where: { id_client: id } });
  }
}
