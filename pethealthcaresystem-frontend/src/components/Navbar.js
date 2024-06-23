import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const pageName = location.pathname.substring(1) || 'Home';

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get('http://localhost:8080/getuser', { withCredentials: true });
        if (result.data) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUser();
  }, []);

  const capitalizeText = (str) => {
    const firstPath = str.split("/")[0] ?? str;
    const strSplit = firstPath.split("-").join(" ");
    return strSplit.split(" ").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
  }

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 3:
        return 'Dr. ';
      case 4:
        return 'Admin. ';
    }
  };

  return (
    <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
      <h1 style={{ color: '#ffff' }}>{capitalizeText(pageName ?? "")}</h1>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
          <img src={user.avatar} alt="Avatar" className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
          <div style={{ color: '#cc3333', marginRight: '5px' }}>{getRoleName(user.roleId)}</div>
          {user.fullName}

        </div>

      )}
    </div>
  );
};

export default Navbar;
