import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const pageName = location.pathname.substring(1) || 'Home';

  const capitalizeText = (str) => {
    const firstPath = str.split("/")[0] ?? str;
    const strSplit = firstPath.split("-").join(" ");
    return strSplit.split(" ").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
  }
  return (
    <div className="navbar">
      <h1>{capitalizeText(pageName ?? "")}</h1>
    </div>
  );
};

export default Navbar;
