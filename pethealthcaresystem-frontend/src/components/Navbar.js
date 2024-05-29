import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const pageName = location.pathname.substring(1) || 'Home';

  return (
    <div className="navbar">
      <h1>{pageName.charAt(0).toUpperCase() + pageName.slice(1)}</h1>
    </div>
  );
};

export default Navbar;
