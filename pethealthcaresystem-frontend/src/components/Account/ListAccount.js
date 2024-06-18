import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';

import './css/account.css';

const ListAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [roleId, setRoleId] = useState(0);

  const { user } = useAuth()

  const loadAccounts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/get-users-by-id", {
        withCredentials: true,
        params: {
          id: roleId,
        },
      });
      setAccounts(response.data?.data ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [roleId]);

  const deleteAccount = async (id) => {
    try {
      await axios.put(`http://localhost:8080/delete-user-by-admin/${id}`);
      loadAccounts();
    } catch (error) {
      alert("There was an error deleting the account!");
      console.error(error);
    }
  };

  return (

    <div className='container'>
      <Link className='btn btn-primary m-3' to={'/account/create'}>Add new Account</Link>
      <div className="dropdown mb-3">
        <label htmlFor="roleId" className="form-label me-2">Role:</label>
        <select
          className="form-select"
          defaultValue={roleId}
          name="roleId"
          id="roleId"
          onChange={(e) => setRoleId(e.target.value)}
        >
          <option value="0">All</option>
          <option value="1">Customer</option>
          <option value="2">Staff</option>
          <option value="3">Vet</option>
        </select>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Full Name</th>
            <th scope="col">Role ID</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td className="col-2">{account.fullName}</td>
              <td className="col-2">{account.roleId}</td>
              <td className='col-2'>{account.isActive ? "Active" : "InActive"}</td>
              <td className="col-3">
                {/* <Link className="btn btn-primary mx-2" to={`/viewAccount/${account.id}`}>View</Link> */}
                <Link className="btn btn-outline-primary mx-2" to={`/edit-account/${account.userId}`}>Edit</Link>
                <button onClick={() => deleteAccount(account.userId)} className="btn btn-danger mx-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default ListAccount;
