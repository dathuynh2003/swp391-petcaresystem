import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Services.css'
import ReactPaginate from 'react-paginate'
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { FormLabel } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'

import { URL } from '../../utils/constant'

export default function Services() {

  const roleId = localStorage.getItem('roleId')


  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(4)
  const { isOpen: isOpenAddServices, onOpen: onOpenAddServices, onClose: onCloseAddServices } = useDisclosure();
  const { isOpen: isOpenEditServices, onOpen: onOpenEditServices, onClose: onCloseEditServices } = useDisclosure();
  const { isOpen: isOpenDeleteServices, onOpen: onOpenDeleteServices, onClose: onCloseDeleteServices } = useDisclosure();
  const [selectedService, setSelectedService] = useState(null)

  const [service, setService] = useState({
    nameService: '',
    price: 0,
    description: '',
  })
  const [img, setImg] = useState(null)



  const [services, setServices] = useState([])

  const loadServices = async () => {
    const response = await axios.get(`${URL}/services?pageNo=${page}&pageSize=${pageSize}`)
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
    // console.log(e.target.files[0])
    //Lấy file đầu tiên trong list file được chọn từ thẻ input type file
    const file = e.target.files[0]
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
    setImg(file)
  }

  const handleCreateService = async () => {
    //Tạo một formData
    // gửi file img và chuỗi json service vào formData
    const formData = new FormData()
    formData.append("file", img)
    formData.append("serviceJson", JSON.stringify(service))
    try {
      const response = await axios.post(`${URL}/create-service`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        , withCredentials: true
      })
      if (response.data.message === 'successfully') {
        toast.success('Service created successfully')
        setService(null)
        setImg(null)
      } else {
        toast.warning(response.data.message)
      }
    } catch (e) {
      toast.error('Failed to create service');
    }
  }

  const handleEditService = async (id) => {
    const formData = new FormData()
    formData.append("serviceJson", JSON.stringify(selectedService))
    if (img !== null) {
      formData.append("file", img);
    }
    try {
      const response = await axios.put(`${URL}/edit-service/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }, withCredentials: true
      })
      if (response.data.message === 'successfully') {
        toast.success('Service edited successfully')
        setImg(null)
        loadServices()
      } else {
        toast.warning(response.data.message)
      }
    } catch (e) {
      toast.error("Failed to edit service")
    }
  }

  const handleDeleteService = async (id) => {
    try {
      const response = await axios.put(`${URL}/delete-service/${id}`, {}, { withCredentials: true })
      if (response.data.message === 'successfully') {
        toast.success('Service delete successfully')
        loadServices()
      } else {
        toast.warning(response.data.message)
      }
    } catch (e) {
      toast.error("Failed to delete service")
    }
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
          <ModalHeader className='text-center'>
            Add New Services
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel className='w-100'>
              Service's Name
              <Input name='nameService' value={service?.nameService}
                onChange={(e) => setService({ ...service, [e.target.name]: e.target.value })}
              />
            </FormLabel>
            <FormLabel className='w-100'>
              Service's Price
              <Input name='price' value={service?.price ? Intl.NumberFormat('vi-VN').format(String(service?.price).replace(/\D/g, '')) : 0}
                onChange={(e) => setService({ ...service, [e.target.name]: e.target.value.replace(/\./g, '') })}
              />
            </FormLabel>
            <FormLabel className='w-100'>
              Service's Description
              <Textarea rows={4} name='description' value={service?.description}
                onChange={(e) => setService({ ...service, [e.target.name]: e.target.value })}
              />
            </FormLabel>
            <FormLabel className='w-100'>
              Service's Image<br />
              <input type='file' className='form-control' onChange={(e) => ChooseImg(e)} />
            </FormLabel>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => onCloseAddServices()}>
              Close
            </Button>
            <Button colorScheme="green" onClick={() => { onCloseAddServices(); handleCreateService() }}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className='row'>
        <h2 className='text-center mb-4 mt-3' style={{ color: 'teal' }}><b>Our services</b></h2>
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
                    <p className="card-text"
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 3,
                        maxHeight: 'calc(1.2em * 3)',
                        lineHeight: '1.2em',
                        whiteSpace: 'normal'
                      }}
                    >
                      {service?.description}
                    </p>
                    {roleId === '4' &&
                      <div className='text-end'>
                        <span style={{ marginRight: '20px' }} className='icon-container'>
                          <EditIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'}
                            onClick={(e) => { e.stopPropagation(); onOpenEditServices(); setSelectedService(service) }}
                          />
                          <span className="icon-text">Edit Service</span>
                        </span>
                        <span style={{ marginRight: '20px' }} className='icon-container'>
                          <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} boxSize={'5'}
                            onClick={(e) => { e.stopPropagation(); setSelectedService(service); onOpenDeleteServices() }} />
                          <span className="icon-text">Delete Service</span>
                        </span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            ))
          }
          <Modal isOpen={isOpenEditServices} onClose={onCloseEditServices} size={'3xl'} >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader className='text-center'>
                Edit Service
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormLabel className='w-100'>
                  Service's Name
                  <Input name='nameService' value={selectedService?.nameService}
                    onChange={(e) => setSelectedService({ ...selectedService, [e.target.name]: e.target.value })}
                  />
                </FormLabel>
                <FormLabel className='w-100'>
                  Service's Price
                  {/* Tự động thêm dấu . tách số tiền ra mỗi 3 số 0 */}
                  <Input name='price' value={selectedService?.price ? Intl.NumberFormat('vi-VN').format(String(selectedService?.price).replace(/\D/g, '')) : 0}
                    // Xóa dấu . đi để gửi về BE k bị lỗi từ 10.000 -> 10
                    onChange={(e) => setSelectedService({ ...selectedService, [e.target.name]: e.target.value.replace(/\./g, '') })}
                  />
                </FormLabel>
                <FormLabel className='w-100'>
                  Service's Description
                  <Textarea rows={4} name='description' value={selectedService?.description}
                    onChange={(e) => setSelectedService({ ...selectedService, [e.target.name]: e.target.value })}
                  />
                </FormLabel>
                <FormLabel className='w-100'>
                  Service's Image<br />
                  <input type='file' className='form-control' onChange={(e) => ChooseImg(e)} />
                </FormLabel>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={() => onCloseEditServices()}>
                  Close
                </Button>
                <Button colorScheme="teal" onClick={() => { onCloseEditServices(); handleEditService(selectedService?.id) }}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Delete Modal */}
          <Modal isOpen={isOpenDeleteServices} onClose={onCloseDeleteServices} size={'3xl'} >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader className='text-center'>
                Are you sure to delete this service?
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormLabel className='w-100'>
                  Service's Name
                  <Input readOnly name='nameService' value={selectedService?.nameService}
                    onChange={(e) => setSelectedService({ ...selectedService, [e.target.name]: e.target.value })}
                  />
                </FormLabel>
                <FormLabel className='w-100'>
                  Service's Price
                  <Input readOnly name='price' value={Intl.NumberFormat('vi-VN').format(String(selectedService?.price).replace(/\D/g, ''))}
                    onChange={(e) => setSelectedService({ ...selectedService, [e.target.name]: e.target.value })}
                  />
                </FormLabel>
                <FormLabel className='w-100'>
                  Service's Description
                  <Textarea readOnly rows={4} name='description' value={selectedService?.description}
                    onChange={(e) => setSelectedService({ ...selectedService, [e.target.name]: e.target.value })}
                  />
                </FormLabel>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={() => onCloseDeleteServices()}>
                  No
                </Button>
                <Button colorScheme="teal" onClick={() => { onCloseDeleteServices(); handleDeleteService(selectedService?.id) }}>
                  Yes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>

  )
}
