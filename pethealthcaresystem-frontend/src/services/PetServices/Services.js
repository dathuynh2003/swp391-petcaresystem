import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Services.css'
import ReactPaginate from 'react-paginate'



export default function Services() {


  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(4)



  const [services, setServices] = useState([])

  const loadServices = async () => {
    const response = await axios.get(`http://localhost:8080/services?pageNo=${page}&pageSize=${pageSize}`)
    setServices(response.data.content)
    setTotalPages(response.data.totalPages);
  }


  useEffect(() => {
    loadServices()
  }, [page])

  const handlePageClick = (data) => {
    setPage(data.selected);
  };


  const navigate = useNavigate()
  const handleServiceClick = (serviceId, serviceName, serviceDescription, servicePrice, serviceImg) => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login')
    }
    else {
      navigate('/booking',
        {
          state:
          {
            id: serviceId,
            nameService: serviceName,
            description: serviceDescription,
            price: servicePrice,
            img: serviceImg
          }
        });
    }

  }



  return (
    <div className='container'>
      <h2 className='text-center mb-4 mt-4'><b>Our services</b></h2>
      <div className='row mx-auto mb-3'>
        {
          services.map((service, index) => (
            <div key={index} className="col-md-3 mb-4 focus-ring"
              onClick={() => { handleServiceClick(service.id, service.nameService, service.description, service.price, service.img) }}
              style={{ cursor: 'pointer' }}
            >
              <div className="card shadow" style={{ width: "17rem" }} >
                <img src={service?.img} className="card-img-top" style={{ width: "17rem", height: "10rem" }} alt="..." />
                <div className="card-body" style={{ height: '100px' }}>
                  <h5 className="card-title">{service.nameService}</h5>
                  <p className="card-text">{service.description}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>


      <div className=''>
        <ReactPaginate
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

    </div>

  )
}
