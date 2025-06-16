import { ProductCard } from "../components/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import { getAllProducts } from "../../../slices/products/selectors";

import "./ProductPage.scss";

const ProductPage = () => {
    const productsItems = useSelector(getAllProducts);

    return (
        <main className="product-page">
            <header className="product-page-title">💻 TecStore</header>
            <section className="products-grid">
                {productsItems.map((p) => (
                    <ProductCard
                        key={p.idProduct}
                        product={p}
                    />
                ))}
            </section>
        </main>
    );
};

export default ProductPage;
