import { Entity, Column, CreateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Client {
  @PrimaryColumn()
  id_client: number;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.client)
  transactions: Transaction[];
}
