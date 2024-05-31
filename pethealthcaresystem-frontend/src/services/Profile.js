import React from 'react';
import { Link } from 'react-router-dom';
import './profile.css'
const Profile = () => {
  return (
    <div>
      <h1>Profile</h1>
      <div className='container row'> 
          <div className='avatar col-3'>
            <img className='rounded-circle' src='https://tse1.mm.bing.net/th?id=OIP.KTq5K5E3QeLVrm71FR0w8gHaHa&pid=Api&P=0&h=220'></img>
    
            <ul class="list-group ">
              <li className='infor list-group-item'>
                  User name
              </li>
              <Link class="list-group-item list-group-item-action custom-item d-inline-flex py-1 px-2 text-decoration-none border rounded-2 text-center">My Pets</Link>
              <Link class="list-group-item list-group-item-action custom-item d-inline-flex py-1 px-2 text-decoration-none border rounded-2">My Appointments</Link>
              <Link class="list-group-item list-group-item-action custom-item d-inline-flex py-1 px-2 text-decoration-none border rounded-2">Item 3</Link>
              <Link class="list-group-item list-group-item-action custom-item d-inline-flex py-1 px-2 text-decoration-none border rounded-2">Item 4</Link>
            </ul>



          </div>
          <div className='profile container col-9'>
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
