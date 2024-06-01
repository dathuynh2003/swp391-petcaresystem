import React from 'react';
import { Link } from 'react-router-dom';
import './profile.css'
const Profile = () => {
  return (
    <div className='container'>
      <div className='row m-4'>
        <div className='avatar col-4 my-4'>
          <img className='rounded-circle my-3 mx-5' src='https://tse1.mm.bing.net/th?id=OIP.KTq5K5E3QeLVrm71FR0w8gHaHa&pid=Api&P=0&h=220'></img>

          <h5 className='text-center' style={{width:'80%'}}>User Name</h5>
          <ul class="list-group ">
            {/* <li className='list-group-item'>
                  User name
              </li> */}
            <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light" to={`/listPets`}>My Pets</Link>
            <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light">My Appointments</Link>
            <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light">Item 3</Link>
            <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light">Item 4</Link>
          </ul>



        </div>
        <div className='profile col-8 my-5'>
          <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
            <h2 className='text-center m-4'>My profile</h2>
            <div className='card'>
              <div className='card-header'>
                <ul className='list-group list group-flush'>
                  <li className='list-group-item'>
                    <b>Username: </b>

                  </li>
                  <li className='list-group-item'>
                    <b>Password: </b>

                  </li>
                  <li className='list-group-item'>
                    <b>Email: </b>

                  </li>
                </ul>
              </div>
              <Link className='btn btn-primary my-2' to={"/"}>Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
