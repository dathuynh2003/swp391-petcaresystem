import { EditIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import { URL } from '../utils/constant';
const Cages = () => {

  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 5

  const [cages, setCages] = useState()
  const [cageName, setCageName] = useState("")

  // const [nameCage, setNameCage] = useState("")

  const loadCage = async (name, page) => {
    const response = await axios.get(`${URL}/cage/search/${name}?page=${page}&size=${pageSize}`, { withCredentials: true })
    if (response.data.message === "Cage found") {
      setCages(response.data.cages.content)
      setTotalPages(response.data.cages.totalPages)
    }
  }

  useEffect(() => {
    loadCage(cageName, currentPage);
  }, [currentPage, cageName])

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCageName(value);
  }

  const handlePageClick = (data) => {
    setCurrentPage(data.selected)
  }

  return (
    <div className='container'>
      <div className='row my-2 w-100'>
        <Button className='add-cage col-2' colorScheme='teal' onClick={() => navigate('/create-cage')}>Add New Cage</Button>
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
          <div className='cage-index row border shadow w-100 mx-auto' key={index} >
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
            <div className="cage-info col-8 row my-1 mx-2 mx-auto ">
              <div className='d-flex justify-content-between row'>
                <h4 className='fs-5 my-0 col-6'>Cage: {cage?.name}</h4>
                <div className='col-6 text-center my-1 border border-dark bg-success-subtle w-25'>
                  {cage?.price.toLocaleString('vi-VN')} VND/hour
                </div>
              </div>

              <div className='row d-flex justify-content-around mx-5' style={{ marginTop: '-1%' }} >
                <div className='d-flex flex-column col-6 w-25'>
                  <div className='text-start'>
                    Size: {cage?.size}
                  </div>
                  <div className='text-start'>
                    Reserved for: {cage?.type}
                  </div>
                </div>

                {cage?.status === "available" && (
                  <div className='col-5 text-start fw-bold text-success pt-3'>Status: {cage?.status}</div>
                )}
                {cage?.status === "occupied" && (
                  <div className='col-5 text-start fw-bold text-danger pt-3'>Status: {cage?.status}</div>
                )}
              </div>

              <div
                className="fs-6 row mt-1 fst-italic fw-medium"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: 1,
                  maxHeight: 'calc(1.2em * 1)',
                  lineHeight: '1.2em',
                  whiteSpace: 'normal'
                }}
              >
                {cage?.description}
              </div>

            </div>
            {/* Button */}
            < div className='col-2 row mx-auto my-auto' >
              {/* <Link className='border border-dark col-4 mx-auto btn btn-primary'>View</Link> */}
              {/* <Link className='border border-dark col-4 mx-auto btn btn-outline-primary' to={`/edit-cage/${cage?.id}`}>Edit</Link> */}
              < span style={{ marginRight: '16px' }} className='icon-container'>
                <EditIcon style={{ color: 'teal', cursor: 'pointer' }} onClick={() => navigate(`/edit-cage/${cage?.id}`)} />
                <span className="icon-text">Edit</span>
              </span>
            </div>
          </div >
        ))}

      </div >
      <div className='mt-3'>
        <ReactPaginate style={{ background: 'teal' }}
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination justify-content-center'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      </div>
    </div >
  );
};

export default Cages;
