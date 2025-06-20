import { Transaction } from './transaction.entity';

export abstract class TransactionRepository {
  abstract save(transaction: Transaction): Promise<Transaction>;
  abstract updateStatus(id: number, status: string): Promise<void>;
  abstract createPendingTransaction(
    transaction_uuid: string,
    id_client: number,
    total: number
  ): Promise<Transaction>;
  abstract updateGatewayTransactionId(id: number, gatewayId: string): Promise<void>;
}
