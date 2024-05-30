import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './services/Login';
import Home from './pages/Home';
import Register from './services/Register';
import Sidenav from './components/Sidenav';
import Navbar from './components/Navbar';
import Services from './services/Services';
import Booking from './services/Booking';
import Pets from './services/Pets';
import Profile from './services/Profile';
import Cages from './services/Cages';
import VetWorkSchedules from './services/VetWorkSchedules';
import Dashboard from './services/Dashboard';

function App() {

  const location = useLocation();
  const hideNavbarAndSidenav = ['/login', '/register'].includes(location.pathname);
  return (

    // <Router>
    <div className="App">
      {!hideNavbarAndSidenav && <Sidenav />}
      {!hideNavbarAndSidenav && <Navbar />}
      <div className={`content ${hideNavbarAndSidenav ? 'full-width' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cages" element={<Cages />} />
          <Route path="/vet-work-schedules" element={<VetWorkSchedules />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
    // </Router>

  );
}

export default App;
