import { queries } from '@testing-library/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const ListAccount = () => {

    const [accounts, setAccounts] = useState([])
    const [roleId, setRoleId] = useState(0)
    const loadAccounts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/get-users-by-id", { withCredentials: true, params: {
        id: roleId
      } })
      setAccounts(response.data?.data ?? [])
        } catch (error) {
            console.log(error)
        }
    }
  
    useEffect(() => {
      loadAccounts()
    }, [roleId])
  
  
    // const deletePet = async (id) => {
    //   const response = await axios.put(`http://localhost:8080/deletePet/${id}`)
    //   loadPets()
    // }
  return (
    <div className='container'>
      <Link className='btn btn-primary m-3' to={'/create-account'}>Add new Account</Link>
      <div className='drop-down'>
        <label for="role">Role:</label>
        <select defaultValue={roleId} name="roleId" id="roleId" onChange={(e) => setRoleId(e.target.value)}>
            <option value="0">All</option>
            <option value="2">Vet</option>
            <option value="3">Staff</option>
        </select>
    </div>
      <table className="table py-4">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">RoleId</th>
            <th scope="col" className='col-2'>Actions</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {
            accounts.map((account, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="col-1">{account.fullName}</td>
                <td className="col-1">{account.roleId}</td>
                <td className='col-3'>
                  {/* <Link className='btn btn-primary mx-2' to={`/viewPet/${pet.petId}`}>View</Link>
                  <Link className='btn btn-outline-primary mx-2' to={`/editPet/${pet.petId}`}>Edit</Link>
                  <button onClick={() => deletePet(pet.petId)} className='btn btn-danger mx2'>Delete</button> */}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default ListAccount
