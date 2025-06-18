import { NavLink } from "react-router-dom";
import CartIcon from "./CartIcon";

import "./BottomMenu.scss";

const BottomMenu = () => {
  return (
    <nav className="bottom-menu">
      <NavLink to="/" className="menu-item">
        🧸 Productos
      </NavLink>
      <NavLink to="/cart" className="menu-item">
        <CartIcon />
      </NavLink>
    </nav>
  );
};

export default BottomMenu;
