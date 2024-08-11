import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = () => {
  const location = useLocation();

  // Determine if the header and footer should be shown based on the current path
  const showHeaderAndFooter = !["/login", "/register"].includes(
    location.pathname
  );

  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderAndFooter && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {showHeaderAndFooter && <Footer />}
    </div>
  );
};

export default Layout;
