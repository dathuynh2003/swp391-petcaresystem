import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Services.css'
import ReactPaginate from 'react-paginate'
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { FormLabel } from 'react-bootstrap'
import { toast } from 'react-toastify'



export default function Services() {

  const roleId = localStorage.getItem('roleId')


  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(4)
  const { isOpen: isOpenAddServices, onOpen: onOpenAddServices, onClose: onCloseAddServices } = useDisclosure();
  const [service, setService] = useState({
    nameService: '',
    price: null,
    description: '',
  })
  const [img, setImg] = useState(null)



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

  const ChooseImg = (e) => {
    //Lấy file đầu tiên trong list file được chọn từ thẻ input type file
    const file = e.target.files[0]
    //Tạo một formData và thêm file đó vào formData với key là file
    const formData = new FormData()
    formData.append('file', file)
    //Check xem file đó có phải img không
    if (!file?.type.startsWith('image/')) {
      toast.warning('Invalid file type. Please upload an image.');
      return;
    }
    //Check size
    if (file?.size > 10 * 1024 * 1024) { // 10MB limit
      toast.warning('File size exceeds the 10MB limit.');
      return;
    }
    // Lưu formData vào state img tí gửi về backend
    setImg(formData)
  }

  return (
    <div className='container' style={{ marginBottom: '0px !important' }}>
      {roleId === '4' ?
        <div className='row mt-5'>
          <Button className='w-25' colorScheme='teal' onClick={() => onOpenAddServices()}>Add New Service </Button>
        </div>
        :
        <div className='row mt-5'>
        </div>
      }
      <Modal isOpen={isOpenAddServices} onClose={onCloseAddServices} size={'3xl'} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add New Services
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel className='w-100'>
              Service's Name
              <Input name='nameService' value={service.nameService}
                onChange={(e) => setService({ ...service, [e.target.name]: e.target.value })}
              />
            </FormLabel>
            <FormLabel className='w-100'>
              Service's Price
              <Input name='price' value={service.price}
                onChange={(e) => setService({ ...service, [e.target.name]: e.target.value })}
              />
            </FormLabel>
            <FormLabel className='w-100'>
              Service's Description
              <Input name='description' value={service.description}
                onChange={(e) => setService({ ...service, [e.target.name]: e.target.value })}
              />
            </FormLabel>
            <FormLabel className='w-100'>
              Service's Image<br />
              <input type='file' className='form-control' onChange={(e) => ChooseImg()} />
            </FormLabel>
          </ModalBody>
          <ModalFooter>
            footer
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className='row'>
        <h2 className='text-center mb-9 mt-4'><b>Our services</b></h2>
        <div className='row mx-auto mb-3 mt-4' style={{ marginBottom: '0px' }}>
          {
            services?.map((service, index) => (
              <div key={index} className="col-md-3 mb-4 focus-ring"
                onClick={() => { handleServiceClick(service?.id, service?.nameService, service?.description, service?.price, service?.img) }}
                style={{ cursor: 'pointer' }}
              >
                <div className="card shadow" style={{ width: "17rem", height: "21rem" }} >
                  <img src={service?.img} className="card-img-top" style={{ width: "17rem", height: "12rem" }} alt="..." />
                  <div className="card-body" style={{ height: '100px' }}>
                    <h5 className="card-title">{service?.nameService}</h5>
                    <p className="card-text">{service?.description}</p>
                    {roleId === '4' &&
                      <div className='text-end'>
                        <span style={{ marginRight: '20px' }} className='icon-container'>
                          <EditIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'} />
                          <span className="icon-text">Edit Service</span>
                        </span>
                        <span style={{ marginRight: '20px' }} className='icon-container'>
                          <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} boxSize={'5'} />
                          <span className="icon-text">Delete Service</span>
                        </span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            ))
          }
        </div>


        <div className='mt-4 mb-0' style={{ marginBottom: '0px' }}>
          <ReactPaginate className=''
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
    </div>

  )
}
