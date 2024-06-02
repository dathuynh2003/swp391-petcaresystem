import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, useLocation, useMatch } from 'react-router-dom';
import Login from './services/Login';
import Home from './pages/Home';
import Register from './services/Register';
import Sidenav from './components/Sidenav';
import Navbar from './components/Navbar';
import Services from './services/Services';
import CreatePet from './services/CreatePet';
import ViewPet from './services/ViewPet';
import ListPets from './services/ListPets';
import EditPet from './services/EditPet';
import Profile from './services/Profile';
import Cages from './services/Cages';
import VetWorkSchedules from './services/VetWorkSchedules';
import Dashboard from './services/Dashboard';
import Verify from './services/Verify';
import CreateShift from './services/CreateShift';


import Booking from './services/Booking/Booking';
function App() {

  const location = useLocation();
  const matchVerify = useMatch('/verify/:email')
  const hideNavbarAndSidenav = ['/login', '/register', '/verify'].includes(location.pathname) || matchVerify;
  return (

    <div className="App">
      {!hideNavbarAndSidenav && <Sidenav />}
      {!hideNavbarAndSidenav && <Navbar />}
      <div className={`content ${hideNavbarAndSidenav ? 'full-screen' : ''}`}>
        <div className={`content ${hideNavbarAndSidenav ? 'full-screen' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/createPet" element={<CreatePet />} />
            <Route path="/viewPet/:petId" element={<ViewPet />} />
            <Route path="/listPets" element={<ListPets />} />
            <Route path="/editPet/:petId" element={<EditPet />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/cages" element={<Cages />} />
            <Route path="/vet-work-schedules" element={<VetWorkSchedules />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/verify' element={<Verify />} />
            <Route path="/shift" element={<CreateShift />} />


            
 
          
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
