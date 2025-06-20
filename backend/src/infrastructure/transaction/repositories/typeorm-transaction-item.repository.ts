import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionItem } from '../../../domain/transaction/transaction-item.entity';
import { TransactionItemRepository } from '../../../domain/transaction/transaction-item.repository';

@Injectable()
export class TypeOrmTransactionItemRepository implements TransactionItemRepository {
  constructor(
    @InjectRepository(TransactionItem)
    private readonly repository: Repository<TransactionItem>,
  ) {}

  async save(items: TransactionItem[]): Promise<void> {
    await this.repository.save(items);
  }
}
