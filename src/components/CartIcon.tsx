import { useSelector } from 'react-redux';
import { selectCartTotalItems } from '../slices/cart/selectors';

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
