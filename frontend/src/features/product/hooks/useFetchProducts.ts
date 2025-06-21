import { useEffect } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { fetchProducts } from "../slices/productsSlice";

export const useFetchProducts = () => {
    const dispatch = useAppDispatch();

    const productsItems = useAppSelector((state) => state.products.items);
    const isLoaded = useAppSelector((state) => state.products.isLoaded);
    const isLoading = useAppSelector((state) => state.products.isLoading);
    const error = useAppSelector((state) => state.products.error);


    useEffect(() => {
        if (isLoaded && productsItems.length > 0) return;
        dispatch(fetchProducts());
    }, []);

    return { isLoading, productsItems, error };
};
