import { Transaction } from './transaction.entity';

export abstract class TransactionRepository {
  abstract save(transaction: Transaction): Promise<Transaction>;
  abstract updateStatus(id: number, status: string): Promise<void>;
}
