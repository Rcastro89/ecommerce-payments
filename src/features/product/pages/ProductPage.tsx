import "./ProductPage.scss";
import { products } from "../../../data/products";
import { ProductCard } from "../components/ProductCard/ProductCard";

const ProductPage = () => {
    return (
        <div>
            {products.map((p) => (
                <ProductCard
                    key={p.idProduct}
                    product={p}
                />
            ))}
        </div>
    );
};

export default ProductPage;
