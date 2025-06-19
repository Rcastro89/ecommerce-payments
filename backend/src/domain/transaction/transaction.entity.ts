import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Client } from '../client/client.entity';
import { Delivery } from '../delivery/delivery.entity';
import { TransactionItem } from './transaction-item.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id_transaction: number;

  @Column({ unique: true })
  transaction_uuid: string;

  @Column()
  status: string; // 'PENDING', 'APPROVED', etc.

  @Column()
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Client, (client) => client.transactions)
  @JoinColumn({ name: 'id_client' })
  client: Client;

  @OneToOne(() => Delivery, (delivery) => delivery.transaction)
  delivery: Delivery;

  @OneToMany(() => TransactionItem, (item) => item.transaction)
  items: TransactionItem[];
}
