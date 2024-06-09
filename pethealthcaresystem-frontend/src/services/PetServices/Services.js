import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Services.css'
export default function Services() {

  const [services, setServices] = useState([])
  const loadServices = async () => {
    const response = await axios.get('http://localhost:8080/services')
    setServices(response.data)
  }

  useEffect(() => {
    loadServices()
  }, [])

  const navigate = useNavigate()
  const handleServiceClick = (serviceId, serviceName, serviceDescription, servicePrice, serviceImg) => {
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


  return (
    <div className='container'>
      <h2 className='text-center mb-3 mt-3'><b>Our services</b></h2>
      <div className='row'>
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

    </div>

  )
}
