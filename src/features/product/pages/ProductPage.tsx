import "./ProductPage.scss";
import { products } from "../../../data/products";
import { ProductCard } from "../components/ProductCard/ProductCard";

const ProductPage = () => {
    const handleAddProduct = (productId: number) => {
        console.log(`Inicio flujo de pago para producto ${productId}`);
        // Aquí más adelante abriremos el modal de pago
    };

    return (
        <div>
            {products.map((p) => (
                <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    description={p.description}
                    price={p.price}
                    stock={p.stock}
                    onAddClick={handleAddProduct}
                />
            ))}
        </div>
    );
};

export default ProductPage;
