import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Avatar, AvatarBadge } from '@chakra-ui/react';
import { URL } from '../utils/constant';
const Navbar = () => {
  const location = useLocation();
  const pageName = location.pathname.substring(1) || 'Home';

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(`${URL}/getuser`, { withCredentials: true });
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
    let title = str.split("/")[0] ?? str;    //   /home  ["", "home"] 
    title = title.split('-').join(' ')
    title = title.charAt(0).toUpperCase() + title.slice(1)   //viết hoa chữ đầu tiên + phần còn lại sau ký tự đầu tiên qua hàm slice(1) 
    return title.split(/(?=[A-Z])/).join(' '); // tìm vị trí mà sau nó là 1 chữ viết hoa tách str thành str có các phần tử bắt đầu là chữ hoa  str = ["List", "Pets"]
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
        <Link to={'/profile'}><div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
          <Avatar src={user.avatar} alt="Avatar" className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
          <div style={{ color: 'white', marginRight: '3px' }}>{getRoleName(user.roleId)}</div>
          {user.fullName}

        </div></Link>

      )}
    </div>
  );
};

export default Navbar;
