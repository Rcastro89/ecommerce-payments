import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  idProduct: number;

  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  price: number;

  @Column('int')
  stock: number;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    idProduct: number,
    name: string,
    description: string,
    price: number,
    stock: number,
    imageUrl: string,
  ) {
    this.idProduct = idProduct;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.imageUrl = imageUrl;
  }
}
