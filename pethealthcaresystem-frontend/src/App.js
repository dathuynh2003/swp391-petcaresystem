import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './services/Login';
import Home from './pages/Home';
import Register from './services/Register';

function App() {
  return (
    <Router>
      <Home />
      <Routes>
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/register' element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
