import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/domain/client/client.entity';
import { ClientRepository } from 'src/domain/client/client.repository';

@Injectable()
export class TypeOrmClientRepository implements ClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
  ) {}

  async save(client: Client): Promise<Client> {
    return this.repository.save(client);
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.repository.findOneBy({ email });
  }
}
