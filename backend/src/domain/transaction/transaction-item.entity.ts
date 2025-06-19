import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from '../product/product.entity';

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id_item: number;

  @Column()
  quantity: number;

  @Column()
  unit_price: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.items)
  @JoinColumn({ name: 'id_transaction' })
  transaction: Transaction;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}
