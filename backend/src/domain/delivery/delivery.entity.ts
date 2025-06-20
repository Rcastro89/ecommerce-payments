import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id_delivery: number;

  @Column()
  address: string;

  @Column()
  delivery_status: string;

  @OneToOne(() => Transaction, (transaction) => transaction.delivery)
  @JoinColumn({ name: 'id_transaction' })
  transaction: Transaction;
}
