import { TransactionItem } from './transaction-item.entity';

export abstract class TransactionItemRepository {
  abstract save(items: TransactionItem[]): Promise<void>;
}
