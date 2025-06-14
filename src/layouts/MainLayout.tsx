// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import BottomMenu from "../components/BottomMenu";
import "../styles/layout.scss";

const MainLayout = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      <BottomMenu />
    </div>
  );
};

export default MainLayout;
