import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Image } from '@chakra-ui/react';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { URL } from '../utils/constant';

export default function Sidenav() {
  let navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const result = await axios.get(`${URL}/getuser`, { withCredentials: true });
      if (result.data !== '') {
        setUser(result.data);
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('roleId')
      }
    } catch (error) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('roleId')
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`${URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('roleId')
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    getUser()
  }, []);

  let links = [];

  const role = user ? user.roleId : 0;

  switch (role) {
    case 0:
      links = [
        { name: 'Home', path: '/', icon: 'fas fa-home' },
        { name: 'Services', path: '/services', icon: 'fas fa-concierge-bell' },
        { name: 'Login', path: '/login', icon: 'fas fa-sign-in-alt' },
        { name: 'Sign Up', path: '/register', icon: 'fas fa-user-plus' },
      ];
      break;
    case 1:
      links = [
        { name: 'Home', path: '/', icon: 'fas fa-home' },
        { name: 'Services', path: '/services', icon: 'fas fa-concierge-bell' },
        { name: 'Booking', path: '/booking', icon: 'fas fa-calendar-check' },
        { name: 'Reservation', path: '/reservation', icon: 'fa-solid fa-book' },
        { name: 'Pets', path: '/listPets', icon: 'fas fa-paw' },
        { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
        { name: 'Logout', path: '/login', icon: 'fas fa-sign-out-alt', onClick: handleLogout },
      ];
      break;
    case 2:
      links = [
        { name: 'Home', path: '/', icon: 'fas fa-home' },
        { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
        { name: 'Cages', path: '/cages', icon: 'fas fa-warehouse' },
        { name: 'Booking Appointments', path: '/staff-booking', icon: 'fas fa-calendar-check' },
        { name: 'Assign Vet\'s Work Schedules', path: '/assign-schedules', icon: 'fas fa-clipboard-list' },
        { name: 'Pet For Customer', path: '/create-pet-by-staff', icon: 'fas fa-paw' },
        { name: 'Booking History', path: 'booking-history', icon: 'fa fa-history' },
        { name: 'Medicine', path: '/medicine', icon: 'fas fa-clipboard-list' },
        { name: 'Logout', path: '/login', icon: 'fas fa-sign-out-alt', onClick: handleLogout },
      ];
      break;
    case 3:
      links = [
        { name: 'Home', path: '/', icon: 'fas fa-home' },
        { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
        { name: 'Booking Appointments', path: '/booking', icon: 'fas fa-calendar-check' },
        { name: 'Work Schedules', path: '/vet-work-schedules', icon: 'fas fa-clipboard-list' },
        { name: 'Logout', path: '/login', icon: 'fas fa-sign-out-alt', onClick: handleLogout },
      ];
      break;
    case 4:
      links = [
        { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Account', path: '/account', icon: 'fa-solid fa-user' },
        { name: 'Services', path: '/services', icon: 'fas fa-concierge-bell' },
        { name: 'Shift', path: '/shift', icon: 'fas fa-clipboard-list' },
        { name: 'System Config', path: '/configuration', icon: 'fa fa-cog' },
        { name: 'Refunds', path: '/refund-requests', icon: <CurrencyExchangeIcon /> },
        { name: 'Logout', path: '', icon: 'fas fa-sign-out-alt', onClick: handleLogout },
      ];
      break;
    default:
      links = [];
  }

  return (
    <div className="sidenav" style={{ background: 'teal' }}>
      <Link to={'/'}><div className="sidenav-header d-flex align-items-center">
        <Image src="../logoApp.svg" alt="Logo" className="logo rounded-circle " style={{ background: 'white' }} />
        <h5 className='text-center' style={{ color: 'white' }}>Pet Health Care</h5>
      </div>
      </Link>
      <ul>
        {links.map((link) => (
          <li key={link.name}>
            <Link to={link.path} onClick={link.onClick}>
              {typeof link.icon === 'string' ? (
                <i className={link.icon} style={{ marginRight: '20px', color: 'white' }}></i>
              ) : (
                <span style={{ marginRight: '20px', color: 'white' }}>{link.icon}</span>
              )}
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
