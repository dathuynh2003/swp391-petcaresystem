import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, useLocation, useMatch } from 'react-router-dom';
import Login from './services/Login';
import Home from './pages/Home';
import Register from './services/Register/Register';
import Sidenav from './components/Sidenav';
import Navbar from './components/Navbar';
import Services from './services/PetServices/Services';
import CreatePet from './services/CreatePet';
import ViewPet from './services/ViewPet';
import ListPets from './services/ListPets';
import EditPet from './services/EditPet';
import Profile from './services/Profile';
import Cages from './services/Cages';
import VetWorkSchedules from './services/VetWorkSchedules';
import Dashboard from './services/Dashboard/Dashboard';
import Verify from './services/Verify';
import CreateShift from './services/CreateShift';
// import CreateAccount from './services/CreateAccount';
import CreatePetByStaff from './services/CreatePetByStaff';
// import ListAccount from './services/ListAccount';
// import EditAccount from './services/EditAccount';
import AssignVetSchedules from './services/AssignVetSchedules';
import Booking from './services/Booking/Booking';
import CreateCage from './services/CreateCage';
import EditCage from './services/EditCage';
import PaymentResult from './services/Booking/PaymentResult';
import StaffBooking from './services/Booking/StaffBooking';
import ViewHospitalization from './services/ViewHospitalization';
import Reservation from './services/Booking/Reservation';
import AccountPage from './pages/Account';
import BookingHistory from './services/Booking/BookingHistory'
import { Fragment } from 'react';
import Medicine from './services/Medicine/Medicine';
import AuthProvider from './context/auth.context';
import PaymentPage from './pages/Payment';
import SystemConfig from './services/SystemConfig/SystemConfig';
import UserChart from './services/Dashboard/UserChart'
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
          <Fragment>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/staff-booking" element={<StaffBooking />} />
              <Route path="/createPet" element={<CreatePet />} />
              <Route path="/viewPet/:petId" element={<ViewPet />} />
              <Route path="/listPets" element={<ListPets />} />
              <Route path="/editPet/:petId" element={<EditPet />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cages" element={<Cages />} />
              <Route path='/create-cage' element={<CreateCage />} />
              <Route path='/edit-cage/:cageId' element={<EditCage />} />
              <Route path="/vet-work-schedules" element={<VetWorkSchedules />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path='/verify' element={<Verify />} />
              <Route path="/shift" element={<CreateShift />} />
              {/* <Route path='/create-account' element={<CreateAccount />} /> */}
              {/* <Route path='/list-account' element={<ListAccount />} /> */}
              {/* <Route path="/edit-account/:userId" element={<EditAccount />} /> */}
              <Route path="/assign-schedules" element={<AssignVetSchedules />} />
              {/* <AuthProvider>
                <Routes>
                <Route path='/payment-result' element={<PaymentResult />} />
                </Routes>
              </AuthProvider> */}
              <Route path="/hospitalization-detail/:id" element={<ViewHospitalization />} />
              <Route path="/create-pet-by-staff" element={<CreatePetByStaff />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path='/booking-history' element={<BookingHistory />} />
              <Route path="/medicine" element={<Medicine />} />
              <Route path="/configuration" element={<SystemConfig />} />
            </Routes >

            <AccountPage />
            <PaymentPage/>

          </Fragment>
        </div >
      </div >

    </div >
  );
}

export default App;
