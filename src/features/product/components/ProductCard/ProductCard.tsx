import "./ProductCard.scss";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  onAddClick: (id: number) => void;
}

export const ProductCard = ({
  id,
  name,
  description,
  price,
  stock,
  onAddClick,
}: ProductCardProps) => {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>{description}</p>
      <p className="price">COP {price.toLocaleString()}</p>
      <p>Stock: {stock}</p>
      <button onClick={() => onAddClick(id)} disabled={stock === 0}>
        Pagar con tarjeta
      </button>
    </div>
  );
};
