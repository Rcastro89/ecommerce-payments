export class Product {
  constructor(
    public readonly idProduct: number,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public stock: number,
  ) {}
}
