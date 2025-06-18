import { useSelector } from 'react-redux';
import { selectCartTotalItems } from '../features/cart/slices/selectors';
import './CartIcon.scss';
import "./BottomMenu.scss";

const CartIcon = () => {
  const totalItems = useSelector(selectCartTotalItems);

  return (
    <>
      🛒 Carrito
      {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
    </>
  );
};

export default CartIcon;
