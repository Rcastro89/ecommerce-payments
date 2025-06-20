import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { TransactionRepository } from 'src/domain/transaction/transaction.repository';
import { Client } from 'src/domain/client/client.entity';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) { }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.repository.save(transaction);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.repository.update(id, { status });
  }

  async createPendingTransaction(
    transaction_uuid: string,
    id_client: number,
    total: number
  ): Promise<Transaction> {
    const transaction = this.repository.create({
      transaction_uuid,
      status: 'PENDING',
      total,
      created_at: new Date(),
      client: { id_client } as Client,
    });

    return this.repository.save(transaction);
  }

  async updateGatewayTransactionId(id: number, gatewayId: string): Promise<void> {
    await this.repository.update(id, { gatewayTransactionId: gatewayId });
  }
}
