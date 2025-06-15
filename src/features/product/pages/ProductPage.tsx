import "./ProductPage.scss";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import { getAllProducts } from "../../../slices/products/selectors";

const ProductPage = () => {
    const productsItems = useSelector(getAllProducts);

    return (
        <div>
            {productsItems.map((p) => (
                <ProductCard
                    key={p.idProduct}
                    product={p}
                />
            ))}
        </div>
    );
};

export default ProductPage;
