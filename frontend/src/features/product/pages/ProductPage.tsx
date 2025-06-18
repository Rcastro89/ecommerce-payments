import { ProductCard } from "../components/ProductCard";
import { useSelector } from "react-redux";
import { getAllProducts } from "../slices/selectors";

import "./ProductPage.scss";
import { useFetchProducts } from "../hooks/useFetchProducts";

const ProductPage = () => {
    const { isLoading, productsItems, error } = useFetchProducts();   

    if (isLoading) return <p>Cargando productos...</p>;
    if (error) return <p>Error: {error}</p>;
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
