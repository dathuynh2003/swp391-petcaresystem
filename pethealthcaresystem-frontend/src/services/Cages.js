import { EditIcon } from '@chakra-ui/icons';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { URL } from '../utils/constant';
const Cages = () => {

  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 5

  //Custom hook useDebounce
  const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value)
      }, delay);
      return () => {
        clearTimeout(timer);
      }
    }, [value, delay])
    return debouncedValue;
  };

  const [cages, setCages] = useState()
  const [cageName, setCageName] = useState("")
  const searchDebounce = useDebounce(cageName, 500);
  const { isOpen: isOpenAddCage, onOpen: onOpenAddCage, onClose: onCloseAddCage } = useDisclosure()
  const { isOpen: isOpenUpdateCage, onOpen: onOpenUpdateCage, onClose: onCloseUpdateCage } = useDisclosure()
  const [newCage, setNewCage] = useState({
    name: '',
    price: null,
    size: '',
    type: '',
    status: 'available',
    description: ''
  })
  const [editedCage, setEditedCage] = useState(null)
  const loadCage = async (name, page) => {
    const response = await axios.get(`${URL}/cage/search/${name}?page=${page}&size=${pageSize}`, { withCredentials: true })
    if (response.data.message === "Cage found") {
      setCages(response.data.cages.content)
      setTotalPages(response.data.cages.totalPages)
    }
  }

  useEffect(() => {
    loadCage(searchDebounce, currentPage);
  }, [currentPage, searchDebounce])

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCageName(value);
  }

  const handlePageClick = (data) => {
    setCurrentPage(data.selected)
  }

  const [petTypes, setPetTypes] = useState([])
  const fetchPetType = async () => {
    const configKey = "petType"
    try {
      const respone = await axios.get(`${URL}/configurations/${configKey}`, { withCredentials: true })
      if (respone.data.message === 'Successfully') {
        setPetTypes(respone.data.configurations)
      }
    } catch (e) {
      // console.log(e)
      navigate('/404page')
    }
  }
  useEffect(() => {
    fetchPetType()
  }, [])

  const onInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    // Nếu input có name là price thì format cái value thêm dấu . vào
    // if (name === 'price') {
    //   // Loại bỏ các ký tự không phải số
    //   const formattedValue = value.replace(/\D/g, '');

    //   // Định dạng giá trị số với dấu chấm làm dấu phân cách hàng nghìn
    //   // formattedValue = new Intl.NumberFormat('vi-VN').format(numericValue);
    //   // formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // }
    if (editedCage === null) {
      setNewCage({ ...newCage, [e.target.name]: formattedValue })
    } else {
      setEditedCage({ ...editedCage, [e.target.name]: formattedValue })
    }
  }

  const handleCreateCage = async () => {
    if (newCage?.name === '' || newCage?.price === null || newCage?.price === '') {
      toast.info("Please enter Cage's name and price")
      return
    }
    if (newCage?.size === '') {
      toast.info("Please select the cage's size");
      return
    }
    if (newCage?.type === '') {
      toast.info("Please select the cage's type")
      return
    }
    try {
      // Loại bỏ dấu chấm ra khỏi giá trị price
      newCage.price = newCage.price.replace(/\./g, '');
      const respone = await axios.post(`${URL}/createCage`, newCage, { withCredentials: true })
      if (respone.data.message === 'Cage created') {
        toast.success('Add new cage successfully!');
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        toast.warning(respone.data.message)
      }
    } catch (e) {
      navigate('/404page')
    }
  }

  const handleEditCage = async () => {
    if (editedCage?.name === '' || editedCage?.price === null || editedCage?.price === '') {
      toast.info("Please enter Cage's name and price")
      return
    }
    if (editedCage?.size === '') {
      toast.info("Please select the cage's size");
      return
    }
    if (editedCage?.type === '') {
      toast.info("Please select the cage's type")
      return
    }
    try {
      // Loại bỏ dấu chấm ra khỏi giá trị price
      editedCage.price = String(editedCage.price).replace(/\./g, '');
      const respone = await axios.put(`${URL}/updateCage/${editedCage.id}`,
        {
          name: editedCage.name,
          price: editedCage.price,
          size: editedCage.size,
          type: editedCage.type,
          status: 'available',
          description: editedCage.description
        },
        { withCredentials: true }
      )
      if (respone.data.message === 'Cage updated') {
        toast.success('Updated Cage Successfully!')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        toast.warning(respone.data.message)
        return;
      }
    } catch (e) {
      toast.error(e.message)
    }
    onCloseUpdateCage()
  }

  return (
    <div className='container'>
      <div className='row my-2 w-100'>
        <Button className='add-cage col-2' colorScheme='teal' onClick={() => onOpenAddCage()}>Add New Cage</Button>
        <Modal isOpen={isOpenAddCage} onClose={onCloseAddCage} size='xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader className='fw-bold text-center my-3 justify-content-center fs-5'>Add New Cage</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" placeholder=""
                  name='name' maxLength={25} value={newCage?.name}
                  onChange={(e) => onInputChange(e)} required />
                <label htmlfor="floatingInput">Enter cage's name</label>
              </div>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" placeholder=""
                  name='price'
                  value={newCage?.price ? Intl.NumberFormat('vi-VN').format(String(newCage?.price).replace(/\D/g, '')) : '0'}
                  maxLength={12}
                  onChange={(e) => onInputChange(e)} required />
                <label htmlfor="floatingInput">Enter cage's price (VND/hour)</label>
              </div>
              <div className="form-floating mb-3 row">
                <div className='w-50'>
                  <Select
                    className='border border-dark col-6'
                    name='type'
                    onChange={onInputChange}
                    placeholder='Select Type'
                  >
                    {petTypes?.map((petType, index) => (
                      <option key={index} lassName='fs-6' value={petType.configValue}>{petType.configValue}</option>
                    ))}
                  </Select>
                </div>
                <div className='w-50'>
                  <Select
                    className='border border-dark col-5'
                    name='size'
                    onChange={onInputChange}
                    placeholder='Select Size'
                  >
                    <option className='fs-6' value="Small">Small</option>
                    <option className='fs-6' value="Medium">Medium</option>
                    <option className='fs-6' value="Large">Large</option>
                  </Select>
                </div>
              </div>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" placeholder=""
                  maxLength={100} name='description' value={newCage?.description}
                  onChange={(e) => onInputChange(e)} required />
                <label htmlfor="floatingInput">Enter cage's description</label>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='teal' mr={3} mb={3} onClick={() => { handleCreateCage(); onCloseAddCage() }}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
            <div className="cage-info col-8 row my-2 mx-2 mx-auto ">
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
                Description: {cage?.description}
              </div>

            </div>
            {/* Button */}
            < div className='col-2 row mx-auto my-auto' >
              {/* <Link className='border border-dark col-4 mx-auto btn btn-primary'>View</Link> */}
              {/* <Link className='border border-dark col-4 mx-auto btn btn-outline-primary' to={`/edit-cage/${cage?.id}`}>Edit</Link> */}
              < span style={{ marginRight: '16px' }} className='icon-container'>
                <EditIcon style={{ color: 'teal', cursor: 'pointer' }} onClick={() => { setEditedCage(cage); onOpenUpdateCage() }} />
                <span className="icon-text">Edit</span>
              </span>
            </div>
          </div >
        ))}

        <Modal isOpen={isOpenUpdateCage} onClose={onCloseUpdateCage} size='xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader className='fw-bold text-center my-3 justify-content-center fs-5'>Update Cage</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" placeholder=""
                  name='name' value={editedCage?.name} maxLength={25}
                  onChange={(e) => onInputChange(e)} required />
                <label htmlfor="floatingInput">Enter cage's name</label>
              </div>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" placeholder=""
                  name='price'
                  value={editedCage?.price ? Intl.NumberFormat('vi-VN').format(String(editedCage.price).replace(/\D/g, '')) : '0'}
                  maxLength={12}
                  onChange={(e) => onInputChange(e)} required />
                <label htmlfor="floatingInput">Enter cage's price (VND/hour)</label>
              </div>
              <div className="form-floating mb-3 row">
                <div className='w-50'>
                  <Select
                    value={editedCage?.type}
                    className='border border-dark col-6'
                    name='type'
                    onChange={onInputChange}
                    placeholder='Select Type'
                  >
                    {petTypes?.map((petType, index) => (
                      <option key={index} lassName='fs-6' value={petType.configValue}>{petType.configValue}</option>
                    ))}
                  </Select>
                </div>
                <div className='w-50'>
                  <Select
                    value={editedCage?.size}
                    className='border border-dark col-5'
                    name='size'
                    onChange={onInputChange}
                    placeholder='Select Size'
                  >
                    <option className='fs-6' value="Small">Small</option>
                    <option className='fs-6' value="Medium">Medium</option>
                    <option className='fs-6' value="Large">Large</option>
                  </Select>
                </div>
              </div>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" placeholder=""
                  name='description' value={editedCage?.description}
                  onChange={(e) => onInputChange(e)} required />
                <label htmlfor="floatingInput">Enter cage's description</label>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='teal' mr={3} mb={3} onClick={() => handleEditCage()}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
    </div >
  );
};

export default Cages;
