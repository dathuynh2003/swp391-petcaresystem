import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Cages = () => {

  const [cages, setCages] = useState()
  const [cageName, setCageName] = useState()

  // const [nameCage, setNameCage] = useState("")

  const loadCage = async (name) => {
    const response = await axios.get(`http://localhost:8080/cage/search/${name}`, { withCredentials: true })
    if (response.data.message === "Cage found") {
      setCages(response.data.cages)
      console.log(response.data.cages)
    } else {
      console.log(response.data.message)
    }
  }

  useEffect(() => {
    loadCage("");
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCageName(value);
    loadCage(value);
  }

  return (
    <div className='container'>
      <div className='row my-3 w-100'>
        <Link className='add-cage btn btn-primary col-2' to={'/create-cage'}>Add New Cage</Link>
        <input
          className="search-cage col-7 shadow mx-auto rounded-pill fs-5"
          type="text"
          value={cageName}
          placeholder="Find cage by name...."
          onChange={handleInputChange}
        />
      </div>
      <div className='list-cage container'>
        {cages?.map((cage, index) => (
          <div className='cage-index row border shadow w-100 mx-auto'  >
            <div
              className="cage-avatar border border-dark my-auto mx-4 rounded-circle col-4"
              style={{ height: '65px', width: '65px', overflow: 'hidden', position: 'relative' }}
            >
              <img
                className="rounded-circle"
                src="https://us.123rf.com/450wm/wenchiawang/wenchiawang1510/wenchiawang151000091/45904030-dog-house-doodle.jpg?ver=6"
                alt="DogImg"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              ></img>
            </div>
            <div className="cage-info col-8 row border border-dark my-2 mx-2">
              <h4 className='fs-5 my-0 col-4'>Cage: {cage?.name}</h4>
              {cage?.status === "available" && (
                <div className='col-3 text-center mx-3 mt-4 border border-dark rounded-pill bg-success text-white'>Status: {cage?.status}</div>
              )}
              {cage?.status === "occupied" && (
                <div className='col-3 text-center mx-3 mt-4 border border-dark rounded-pill bg-danger text-white'>Status: {cage?.status}</div>
              )}

              <div className='col-3 text-center mx-3 mt-4 border border-dark bg-success-subtle'>
                {cage?.price.toLocaleString('vi-VN')} VND/hour
              </div>

              <div className="fs-6 col-12 mt-0">
                {cage?.description}
              </div>

            </div>
            {/* Button */}
            <div className='col-2 row m-auto'>
              <Link className='border border-dark col-4 mx-auto btn btn-primary'>View</Link>
              <Link className='border border-dark col-4 mx-auto btn btn-outline-primary' to={`/edit-cage/${cage?.id}`}>Edit</Link>
            </div>
          </div>
        ))}

      </div>
    </div >
  );
};

export default Cages;
