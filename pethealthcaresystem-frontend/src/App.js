import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, useLocation, useMatch, useParams, Navigate } from 'react-router-dom';
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
import CreatePetByStaff from './services/CreatePetByStaff';
import AssignVetSchedules from './services/AssignVetSchedules';
import Booking from './services/Booking/Booking';
import CreateCage from './services/CreateCage';
import EditCage from './services/EditCage';
import PaymentResult from './services/Booking/PaymentResult';
import StaffBooking from './services/Booking/StaffBooking';
import Reservation from './services/Booking/Reservation';
import AccountPage from './pages/Account';
import BookingHistory from './services/Booking/BookingHistory'
import { Fragment } from 'react';
import Medicine from './services/Medicine/Medicine';
import AuthProvider from './context/auth.context';
import PaymentPage from './pages/Payment';
import SystemConfig from './services/SystemConfig/SystemConfig';
import RefundRequests from './services/RefundRequests';

import { Permission } from './components/Permission';
import NotFound from './pages/NotFound';
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
              <Route path="/booking" element={
                <AuthProvider>
                  <Permission roleId={['2', '1', '3']} redirect={true}>
                    <Booking />
                  </Permission>
                </AuthProvider>

              } />
              <Route path="/staff-booking" element={
                <AuthProvider >
                  <Permission roleId={['2']} redirect={true}>
                    <StaffBooking />
                  </Permission>
                </AuthProvider>

              } />
              <Route path="/createPet" element={
                <AuthProvider>
                  <Permission roleId={['1']} redirect={true}>
                    <CreatePet />
                  </Permission>
                </AuthProvider>
              } />
              <Route path="/viewPet/:petId" element={
                <ConditionalViewPet>
                  <AuthProvider>
                    <Permission roleId={['1', '2', '3']} redirect={true}>
                      <ViewPet />
                    </Permission>
                  </AuthProvider>
                </ConditionalViewPet>
              } />
              <Route path="/listPets" element={
                <AuthProvider>
                  <Permission roleId={['1']} redirect={true}>
                    <ListPets />
                  </Permission>
                </AuthProvider>


              } />
              <Route path="/editPet/:petId" element={
                <AuthProvider>
                  <Permission roleId={['1']} redirect={true}>
                    <EditPet />
                  </Permission>
                </AuthProvider>


              } />
              <Route path="/profile" element={
                <AuthProvider>
                  <Permission roleId={['1', '2', '3']} redirect={true}>
                    <Profile />

                  </Permission>
                </AuthProvider>


              } />
              <Route path="/cages" element={
                <AuthProvider>
                  <Permission roleId={['2']} redirect={true}>
                    <Cages />
                  </Permission>
                </AuthProvider>


              } />
              <Route path='/create-cage' element={
                <AuthProvider>
                  <Permission roleId={['2']} redirect={true}>
                    <CreateCage />
                  </Permission>
                </AuthProvider>



              } />
              <Route path='/edit-cage/:cageId' element={
                <AuthProvider>
                  <Permission roleId={['2']} redirect={true}>
                    <EditCage />
                  </Permission>
                </AuthProvider>


              } />
              <Route path="/vet-work-schedules" element={
                <AuthProvider>
                  <Permission roleId={['3']} redirect={true}>
                    <VetWorkSchedules />
                  </Permission>
                </AuthProvider>

              } />
              <Route path="/dashboard" element={
                <AuthProvider>
                  <Permission roleId={['4']} redirect={true}>
                    <Dashboard />

                  </Permission>
                </AuthProvider>

              } />
              <Route path='/verify' element={

                <Verify />

              } />
              <Route path="/shift" element={
                <AuthProvider>
                  <Permission roleId={['4']} redirect={true}>
                    <CreateShift />
                  </Permission>
                </AuthProvider>

              } />
              <Route path="/assign-schedules" element={
                <AuthProvider>
                  <Permission roleId={['2']} redirect={true}>
                    <AssignVetSchedules />

                  </Permission>
                </AuthProvider>

              } />
              <Route path="/create-pet-by-staff" element={
                <AuthProvider>
                  <Permission roleId={['2']} redirect={true}>
                    <CreatePetByStaff />
                  </Permission>
                </AuthProvider>

              } />
              <Route path="/reservation" element={
                <AuthProvider>
                  <Permission roleId={['1']} redirect={true}>
                    <Reservation />
                  </Permission>
                </AuthProvider>


              } />
              <Route path='/booking-history' element={
                <AuthProvider>
                  <Permission roleId={['2']} redirect={true}>
                    <BookingHistory />
                  </Permission>
                </AuthProvider>


              } />
              <Route path="/medicine" element={
                <AuthProvider>
                  <Permission roleId={['2']} redirect={true}>
                    <Medicine />
                  </Permission>
                </AuthProvider>


              } />
              <Route path='/payment-result' element={
                <AuthProvider>
                  <Permission roleId={['1']} redirect={true} >
                    <PaymentResult />
                  </Permission>
                </AuthProvider>


              } />
              <Route path="/account/*" element={<AccountPage />} />

              <Route path="/configuration" element={
                <AuthProvider>
                  <Permission roleId={['4']} redirect={true}>
                    <SystemConfig />
                  </Permission>
                </AuthProvider>


              } />
              <Route path="/refund-requests" element={
                <AuthProvider>
                  <Permission roleId={['4']} redirect={true}>
                    <RefundRequests />
                  </Permission>
                </AuthProvider>


              } />
               <Route path="/NotFound" element={<NotFound />} />
            </Routes >


            {/* <AccountPage /> */}
            {/* <PaymentPage/> */}

          </Fragment >
        </div >
      </div >

    </div >
  );
}
const ConditionalViewPet = () => {
  const location = useLocation();
  const roleId = localStorage.getItem('roleId');

  // Nếu roleId = 3 mà không có state từ navigate thì chuyển hướng đến /page404
  if (roleId === '3' && !location.state?.fromButton) {
    return <Navigate to="/page404" />;
  }

  return <ViewPet />;
};
export default App;
