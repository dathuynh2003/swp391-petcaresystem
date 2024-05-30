  import React, { useEffect, useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import axios from 'axios';

  export default function Sidenav() {

    let navigate = useNavigate();

    const isLoggedIn = localStorage.getItem('isLoggedIn');

    const [user, setUser] = useState(null);

    const getUser = async () => {
      const result = await axios.get(`http://localhost:8080/getuser`, { withCredentials: true });
      setUser(result.data);
    };

    const handleLogout = async () => {
      try {
        // e.preventDefault();
        await axios.post(`http://localhost:8080/logout`, {}, { withCredentials: true });
        localStorage.setItem('isLoggedIn', 'false');
        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    useEffect(() => {
      if (isLoggedIn === 'true') {
        getUser();
      } else {
        setUser(null);
      }
    }, [isLoggedIn]);

    let links = [];

    const role = user ? user.role : '0';

    if (user) {
      switch (role) {
        case 'Guest':
          links = [
            { name: 'Home', path: '/', icon: 'fas fa-home' },
            { name: 'Services', path: '/services', icon: 'fas fa-concierge-bell' },
            { name: 'Login', path: '/login', icon: 'fas fa-sign-in-alt' },
            { name: 'Sign Up', path: '/register', icon: 'fas fa-user-plus' },
          ];
          break;
        case 'Customer':
          links = [
            { name: 'Home', path: '/', icon: 'fas fa-home' },
            { name: 'Services', path: '/services', icon: 'fas fa-concierge-bell' },
            { name: 'Booking', path: '/booking', icon: 'fas fa-calendar-check' },
            { name: 'Pets', path: '/pets', icon: 'fas fa-paw' },
            { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
            { name: 'Logout', path: '#', icon: 'fas fa-sign-out-alt', onClick: handleLogout },
          ];
          break;
        case 'Staff':
          links = [
            { name: 'Home', path: '/', icon: 'fas fa-home' },
            { name: 'Cages', path: '/cages', icon: 'fas fa-warehouse' },
            { name: 'Booking Appointments', path: '/booking', icon: 'fas fa-calendar-check' },
            { name: 'Vet\'s Work Schedules', path: '/vet-work-schedules', icon: 'fas fa-clipboard-list' },
            { name: 'Logout', path: '#', icon: 'fas fa-sign-out-alt', onClick: handleLogout },
          ];
          break;
        case 'Vet':
          links = [
            { name: 'Home', path: '/', icon: 'fas fa-home' },
            { name: 'Booking Appointments', path: '/booking', icon: 'fas fa-calendar-check' },
            { name: 'Work Schedules', path: '/vet-work-schedules', icon: 'fas fa-clipboard-list' },
            { name: 'Logout', path: '#', icon: 'fas fa-sign-out-alt', onClick: handleLogout },
          ];
          break;
        case 'Admin':
          links = [
            { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
            { name: 'Logout', path: '#', icon: 'fas fa-sign-out-alt', onClick: handleLogout },
          ];
          break;
        default:
          links = [];
      }
    } else {
      links = [
        { name: 'Home', path: '/', icon: 'fas fa-home' },
        { name: 'Services', path: '/services', icon: 'fas fa-concierge-bell' },
        { name: 'Login', path: '/login', icon: 'fas fa-sign-in-alt' },
        { name: 'Sign Up', path: '/register', icon: 'fas fa-user-plus' },
      ];
    }

    return (
      <div className="sidenav">
        <div className="sidenav-header">
          <img src="assets/logoPetCare.png" alt="Logo" className="logo" />
          <h4>Pet Health Care</h4>
        </div>
        <ul>
          {links.map(link => (
            <li key={link.name}>
              <Link to={link.path} onClick={link.onClick}>
                <i className={link.icon}></i>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
