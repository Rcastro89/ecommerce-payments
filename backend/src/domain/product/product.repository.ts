import { Product } from './product.entity';

export abstract class ProductRepository {
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: number): Promise<Product | null>;
  abstract save(product: Product): Promise<Product>;
  abstract updateStock(id: number, newStock: number): Promise<void>;
  abstract preloadData(products: Product[]): Promise<void>;
}
