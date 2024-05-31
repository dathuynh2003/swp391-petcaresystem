import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export default function ListPets() {

  const [pets, setPets] = useState([])

  const loadPets = async () => {
    const response = await axios.get("http://localhost:8080/pet")
    setPets(response.data)
  }

  useEffect(()=>{
    loadPets()
  },[])

 
  const deletePet = async (id)=>{
    const response = await axios.put(`http://localhost:8080/deletePet/${id}`)
    loadPets()
  }

  return (
    <div>
      <Link className='btn btn-primary mx-2' to={'/createPet'}>Add new Pet</Link>
<table className="table py-4">
    <thead>
        <tr>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Breed</th>
            <th scope="col">Gender</th>
            <th scope="col">Age</th>
            <th scope="col">Neutered</th>
            <th scope="col">Description</th>
            <th scope="col" className='col-2'>Actions</th> 
        </tr>
    </thead>
    <tbody className="table-group-divider">
        {
            pets.map((pet, index) => (
            <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="col-1">{pet.name}</td>
                <td className="col-1">{pet.petType}</td>
                <td className="col-1">{pet.breed}</td>
                <td className="col-1">{pet.gender}</td>
                <td className="col-1">{pet.age}</td>
                <td className="col-1">{pet.isNeutered? 'Yes':'No'}</td>
                <td className="col-3">{pet.description}</td>
                <td className='col-3'>
                    <Link className='btn btn-primary mx-2' to={`/viewPet/${pet.petId}`}>View</Link>
                    <Link className='btn btn-outline-primary mx-2' to={`/editPet/${pet.petId}`}>Edit</Link>
                    <button onClick={()=>deletePet(pet.petId)} className='btn btn-danger mx2'>Delete</button>
                </td>
            </tr>
            ))
        }
    </tbody>
</table>

  
    </div>
  )
}
