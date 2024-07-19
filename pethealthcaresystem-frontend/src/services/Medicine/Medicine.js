import React, { useEffect, useState } from 'react'
import { Button, Input, Select, background, useDisclosure } from '@chakra-ui/react'
import ReactPaginate from 'react-paginate'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';
import { EditIcon } from '@chakra-ui/icons';
import './Medicine.css'
import { SearchIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../utils/constant'

export default function Medicine() {

  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login')
    }
    const roleId = localStorage.getItem('roleId')
    if (roleId !== '2') {
      navigate('/404page')
    }
    fetchMedicineUnit()
  }, [])

  const [medicineUnits, setMedicineUnits] = useState([])
  const fetchMedicineUnit = async () => {
    const configKey = "medicineUnit"
    try {
      const respone = await axios.get(`${URL}/configurations/${configKey}`, { withCredentials: true })
      if (respone.data.message === 'Successfully') {
        setMedicineUnits(respone.data.configurations)
      }
    } catch (e) {
      navigate('404page')
    }
  }



  // const [filter, setFilter] = useState({

  //   searchTerm: '',
  //   expiredMedicine: false,
  //   pageNo: 0,
  //   pageSize: 5
  // })





  let keyword1 = ''
  const [returnListAll, setReturnListAll] = useState(false)
  const [currentPage, setCurrentPage] = useState('pageNo')
  const [pageNo, setPageNo] = useState(0)
  const [pageNoSearch, setPageNoSearch] = useState(0)
  const [pageNoExpired, setPageNoExpired] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 10
  const [keyword, setKeyWord] = useState('')
  const [medicines, setMedicines] = useState([])

  const handlePageClick = (data) => {
    console.log('chon trang');
    console.log('chon trang: ' + data.selected);
    switch (currentPage) {
      case 'pageNo':
        setPageNo(() => data.selected);
        break;
      case 'pageNoSearch':
        setPageNo(() => 0)
        setPageNoSearch(() => data.selected);

        break;
      case 'pageNoExpired':
        setPageNoExpired(() => data.selected);
        break;
      default:
        break;
    }
  }


  const loadMedicines = async () => {
    try {
      setCurrentPage(() => "pageNo")
      setPageNoExpired(() => 0)
      console.log("DANG o: " + currentPage);
      console.log("pageNo: " + pageNo);
      console.log("pageSearch: " + pageNoSearch);
      const response = await axios.get(`${URL}/medicine/list?pageNo=${pageNo}&pageSize=${pageSize}`, { withCredentials: true })
      setMedicines(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.log(error);
    }
  }
  // console.log("Trang hien tai la: " + currentPage);
  // console.log("pageNo: " + pageNo);
  // console.log("pageNoSearch: " + pageNoSearch);
  // console.log("tong trang: " + totalPages);

  useEffect(() => {

    if (keyword.trim() === '') {
      setCurrentPage(() => 'pageNo')
      loadMedicines()
      return
    }
    // handleOnclickSearch();
  }, [keyword])




  useEffect(() => {
    loadMedicines()
  }, [pageNo])

  useEffect(() => {
    setPageNo(() => 0)
    handleLoadExpiredMedicine()
  }, [pageNoExpired])

  const changePageType = (type) => {
    setCurrentPage(() => type);
  }







  const handleOnclickSearch = async (e) => {
    setCurrentPage(() => 'pageNoSearch')
    setPageNo(() => 0)
    setPageNoExpired(0)
    try {
      keyword1 = e.target.value

      console.log("tr oi day ne: " + keyword);
      setCurrentPage('pageNoSearch')
      console.log("Dang o pageSearch: " + currentPage);
      console.log("keyword " + keyword);
      console.log("pageNoSearch" + pageNoSearch);
      console.log("pageNo: " + pageNo);
      console.log("totalPages: " + totalPages)

      // if(keyword.trim() === ''){
      //   setCurrentPage('pageNo')
      //   return
      // }else{
      //   setCurrentPage('pageNoSearch')
      // }


      // setPageNoSearch(0)
      //  if (keyword.trim() !== '') {


      // setPageNoSearch(0)
      console.log(pageSize);
      console.log("keyword day ne:  " + keyword);
      const response = await axios.get(`${URL}/medicine/search/${keyword1}?pageNo=${pageNoSearch}&pageSize=${2}`, { withCredentials: true });

      setTotalPages(response.data.MEDICINES.totalPages)
      setMedicines(response.data.MEDICINES.content)
      console.log("tong trang search: " + totalPages);
      console.log(response.data.MEDICINES.content);
      // }
      // else{
      //   setCurrentPage('pageNo')
      //   setPageNoSearch(0)
      //   loadMedicines()
      // }

    } catch (error) {
      console.log(error);
    }

  }
  const callAPISearch = async () => {

    try {
      const response = await axios.get(`${URL}/medicine/search/${keyword}?pageNo=${pageNoSearch}&pageSize=${2}`, { withCredentials: true });
      setMedicines(response.data.MEDICINES.content)
      setTotalPages(response.data.MEDICINES.totalPages)
    } catch (error) {
      console.log(error);
    }

  }


  useEffect(() => {
    setPageNo(() => 0)
    callAPISearch()
    // handleOnclickSearch()

  }, [pageNoSearch])

  useEffect(() => {
    switch (currentPage) {
      case 'pageNo':
        setPageNoSearch(() => 0); // Đặt lại pageNoSearch về 0 khi currentPage là 'pageNo'
        loadMedicines();
        break;
      case 'pageNoSearch':
        setPageNoSearch(() => 0); // Đặt lại pageNoSearch về 0 khi currentPage là 'pageNoSearch'
        callAPISearch();
        break;
      case 'pageNoExpired':
        setPageNo(() => 0);
        handleLoadExpiredMedicine();
        break;
      default:
        break;
    }
  }, [currentPage])

  const getCurrentPageNo = () => {
    switch (currentPage) {
      case 'pageNo':
        return pageNo;
      case 'pageNoSearch':
        return pageNoSearch;
      case 'pageNoExpired':
        return pageNoExpired;
      default:
        return 0; // hoặc giá trị mặc định khác nếu cần
    }
  };



  const handleLoadExpiredMedicine = async () => {
    setPageNo(0)
    setCurrentPage('pageNoExpired')
    // setPageNoExpired(0)
    console.log('nutbam' + returnListAll);

    try {
      if (returnListAll === false) {

        const response = await axios.get(`${URL}/medicine/expired?pageNo=${pageNoExpired}&pageSize=${1}`, { withCredentials: true });
        setMedicines(response.data.content)
        setTotalPages(response.data.totalPages)
      } else {
        // loadMedicines()
      }
      // setReturnListAll(returnListAll === false ? true : false)

      // if (returnListAll === true){
      //   setCurrentPage('pageNo')

      // }
      // setCurrentPage(currentPage === 'pageNoExpired' ? 'pageNo' : 'pageNoExpired')
    } catch (error) {
      console.log(error);
    }

  }
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
  const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure()

  const [medicine, setMedicine] = useState({
    name: '',
    description: '',
    quantity: 1,
    price: 1,
    unit: '',

    mfgDate: '',
    expDate: ''
  })
  console.log(medicine)




  const today = new Date().toLocaleDateString("en-CA");

  const handleMFGDate = (e) => {
    console.log(today);
    console.log(e.target.value);
    if (e.target.value <= today) {
      setMedicine((prev) => ({ ...prev, mfgDate: e.target.value }))
      setSelectedMedicine((prev) => ({ ...prev, mfgDate: e.target.value }))

    }
    else {
      toast.error("The manufacturing date is invalid (must be before or equal current date)!")
      setMedicine((prev) => ({ ...prev, mfgDate: null }))
      setSelectedMedicine((prev) => ({ ...prev, mfgDate: null }))

    }

  }
  const handleEXPDate = (e) => {

    if (e.target.value > today) {
      setMedicine((prev) => ({ ...prev, expDate: e.target.value }))
      setSelectedMedicine((prev) => ({ ...prev, expDate: e.target.value }))

    }
    else {
      toast.error("The expiration date is invalid (must be larger than manufacturing date!)")
      setMedicine((prev) => ({ ...prev, expDate: null }))
      setSelectedMedicine((prev) => ({ ...prev, expDate: null }))
    }
  }

  const callAddMedicineAPI = async () => {
    try {
      const listError = [];
      if (!medicine?.name) {
        listError.push("Medicine's name can not empty!")
      }
      if (!medicine?.mfgDate) {
        listError.push("The manufacturing date is invalid!")
      }
      if (!medicine?.expDate) {
        listError.push("The expiration date  is invalid!")
      }
      if (!medicine?.unit) {
        listError.push("Unit's medicine is required!")
        listError.push("Add medicine failed!")
      }
      if (listError.length === 0) {
        const response = await axios.post(`${URL}/medicine/add`, medicine, { withCredentials: true })
        if (response.data !== null || response.data !== undefined) {
          toast.success("Add medicine successfully!")
          loadMedicines()
        }
        else
          toast.error("Add medicine failed!")
      }
      for (let index = 0; index < listError.length; index++) {
        toast.error(listError[index]);
      }

    } catch (error) {
      console.log(error);
    }

  }

  const [selectedMedicine, setSelectedMedicine] = useState(null)

  const handleClickEditMedicine = (medicine) => {
    setSelectedMedicine(medicine)
    onOpen2()
  }
  const handleClickDeleteMedicine = (medicine) => {
    setSelectedMedicine(medicine)
    onOpen3()
  }

  const callEditMedicineAPI = async () => {
    try {

      const listError = [];
      // handleEXPDate(selectedMedicine)
      // handleMFGDate(selectedMedicine)
      if (!selectedMedicine?.name) {
        listError.push("Medicine's name can not empty!")
      }
      if (!selectedMedicine?.mfgDate) {
        listError.push("The manufacturing date is invalid!")
      }
      if (!selectedMedicine?.expDate) {
        listError.push("The expiration date  is invalid!")
      }
      if (!selectedMedicine?.unit) {
        listError.push("Unit's medicine is required!")
        listError.push("Add medicine failed!")
      }
      if (listError.length === 0) {
        const response = await axios.put(`${URL}/medicine/edit/${selectedMedicine?.id}`, selectedMedicine, { withCredentials: true })
        if (response.data !== null || response.data !== undefined) {
          toast.success("Edit medicine successfully!")
          loadMedicines()
        }
      }
      else {
        toast.error("Edit medicine failed!")
        for (let index = 0; index < listError.length; index++) {
          toast.error(listError[index]);
        }
      }

    } catch (error) {
      console.log(error);
    }


  }
  const callDeleteMedicineAPI = async () => {
    try {
      const response = await axios.put(`${URL}/medicine/delete/${selectedMedicine?.id}`, [], { withCredentials: true })
      console.log(response.data);
      if (response.data === 'Medicine deleted successfully') {
        toast.success(response.data)
        loadMedicines()
      } else {
        toast.error("Delete medicine failed!")
      }
    } catch (error) {
      console.log(error);
    }
    onClose3()

  }

  return (
    <div className='container '>
      <div className='row'>
        <ToastContainer />

        <div className='mt-4 mb-3 d-flex justify-content-between'>
          <div>
            <Button colorScheme='teal' style={{ marginRight: '15px' }} onClick={onOpen1}>Add new medicine</Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen1} onClose={onClose1} size={'xl'}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add new medicine</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="name@example.com"
                      onChange={(e) => (setMedicine((prev) => ({ ...prev, name: e.target.value })))} required />
                    <label htmlfor="floatingInput">Enter medicine's name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea"
                      onChange={(e) => (setMedicine((prev) => ({ ...prev, description: e.target.value })))}></textarea>
                    <label htmlfor="floatingTextarea">Description</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="date" className="form-control" id=""
                      onChange={(e) => (handleMFGDate(e))} required />
                    <label htmlfor="floatingInput">Enter manufacturing date</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="date" className="form-control" id="floatingInput" placeholder="dd/mm/yyyy"
                      onChange={(e) => (handleEXPDate(e))} required />
                    <label htmlfor="floatingInput">Enter expiration date</label>
                  </div>



                  <div className="d-flex justify-content-between">
                    <div>
                      Unit
                      <Select placeholder='Choose unit' onChange={(e) => { setMedicine((prev) => ({ ...prev, unit: e.target.value })) }}>
                        {/* <option value='Bottle'>Bottle </option>
                        <option value='Bottle'>Bottle </option>
                        <option value='Box'>Box</option>
                        <option value='Blister pack'>Blister pack</option>
                        <option value='Ampoule'>Ampoule</option>
                        <option value='Sachet'>Sachet</option> */}
                        {medicineUnits?.map((unit, index) => (
                          <option key={index} value={unit.configValue}>{unit.configValue}</option>
                        ))}
                      </Select>
                    </div>
                    <div >
                      Quantity
                      <NumberInput maxW={20} defaultValue={1} min={1} onChange={(e) => (setMedicine((prev) => ({ ...prev, quantity: e })))} >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </div>

                    <div>
                      Price
                      <NumberInput defaultValue={1} min={1} onChange={(e) => (setMedicine((prev) => ({ ...prev, price: e })))}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </div>

                  </div>

                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='teal' mr={3} onClick={callAddMedicineAPI}>
                    Save
                  </Button>
                  <Button onClick={onClose1}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>


            {/* <Button colorScheme='pink' onClick={() => changePageType('pageNoExpired')} className={currentPage === 'pageNoExpired' ? 'active' : ''}>Expired Medicine</Button> */}
          </div>


          <div className="search-container rounded shadow">
            <div className="search-wrapper">
              <SearchIcon onClick={loadMedicines} boxSize={6} style={{ marginRight: '8px', marginLeft: '5px' }} className='search-icon' />
              <input
                onChange={(value) => { setCurrentPage(() => 'pageNoSearch'); setKeyWord(value.target.value); handleOnclickSearch(value) }}/*(value) => setKeyWord(value.target.value)*/
                className='rounded text-center fst-italic border-0'
                style={{ height: '2.5rem', width: '14rem', outline: 'none' }}
                placeholder='Search medicine'
              />
            </div>
          </div>
        </div>

        <div>
          <table className="table table-hover">

            <thead >
              <tr className='text-center '>
                <th className="col-1"> No</th>
                <th className="col-2">Name</th>
                <th className="col-3">Description</th>

                <th>Unit</th>
                <th>Quantity</th>
                <th className="col-2">MFG. Date</th>
                <th className="col-2">EXP. Date</th>
                <th className="col-1">Price</th>
                <th className='col-2'>Action</th>
              </tr>
            </thead>

            <tbody>
              {
                medicines?.map((medicine, index) => (
                  <tr className='text-center item'>
                    <td >{getCurrentPageNo() * pageSize + index + 1}</td>
                    <td >{medicine.name}</td>
                    <td >{medicine.description}</td>
                    <td>{medicine.unit}</td>
                    <td>{medicine.quantity}</td>
                    <td>{new Date(medicine.mfgDate).toLocaleString("en-GB", { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                    <td>{new Date(medicine.expDate).toLocaleString("en-GB", { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                    <td>{medicine.price.toLocaleString('vi-VN')} VND</td>
                    <td className=''>
                      <span style={{ marginRight: '16px' }} className='icon-container'>
                        <EditIcon style={{ color: 'teal', cursor: 'pointer' }} onClick={() => handleClickEditMedicine(medicine)} />
                        <span className="icon-text">Edit</span>

                      </span>
                      <span className='icon-container'>
                        <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleClickDeleteMedicine(medicine)} />
                        <span className="icon-text">Delete</span>
                      </span>
                    </td>


                  </tr>
                ))}
            </tbody>

          </table>
        </div>


        <div>

          <Modal closeOnOverlayClick={false} isOpen={isOpen2} onClose={onClose2} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit medicine</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="floatingInput" placeholder="name@example.com"
                    value={selectedMedicine?.name}
                    onChange={(e) => (setSelectedMedicine((prev) => ({ ...prev, name: e.target.value })))} required />
                  <label htmlfor="floatingInput">Enter medicine's name</label>
                </div>
                <div className="form-floating mb-3">
                  <textarea className="form-control" id="floatingTextarea" value={selectedMedicine?.description}
                    onChange={(e) => (setSelectedMedicine((prev) => ({ ...prev, description: e.target.value })))}></textarea>
                  <label htmlfor="floatingTextarea">Description</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="date" className="form-control" id="" value={selectedMedicine?.mfgDate}
                    onChange={(e) => (handleMFGDate(e))} required />
                  <label htmlfor="floatingInput">Enter manufacturing date</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="date" className="form-control" id="floatingInput" placeholder="dd/mm/yyyy" value={selectedMedicine?.expDate}
                    onChange={(e) => (handleEXPDate(e))} required />
                  <label htmlfor="floatingInput">Enter expiration date</label>
                </div>



                <div className="d-flex justify-content-between">
                  <div>
                    Unit
                    <Select placeholder='Choose unit' value={selectedMedicine?.unit} onChange={(e) => { setSelectedMedicine((prev) => ({ ...prev, unit: e.target.value })) }}>
                      {/* <option value='Bottle'>Bottle </option>
                      <option value='Tube'>Tube</option>
                      <option value='Box'>Box</option>
                      <option value='Blister pack'>Blister pack</option>
                      <option value='Ampoule'>Ampoule</option>
                      <option value='Sachet'>Sachet</option> */}
                      {medicineUnits?.map((unit, index) => (
                        <option key={index} value={unit.configValue}>{unit.configValue}</option>
                      ))}
                    </Select>
                  </div>
                  <div >
                    Quantity
                    <NumberInput maxW={20} defaultValue={1} min={1} value={selectedMedicine?.quantity} onChange={(e) => (setSelectedMedicine((prev) => ({ ...prev, quantity: e })))} >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </div>

                  <div>
                    Price
                    <NumberInput defaultValue={1} min={1} value={selectedMedicine?.price} onChange={(e) => (setSelectedMedicine((prev) => ({ ...prev, price: e })))}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </div>

                </div>

              </ModalBody>

              <ModalFooter>
                <Button colorScheme='teal' mr={3} onClick={callEditMedicineAPI}>
                  Save
                </Button>
                <Button onClick={onClose2}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal closeOnOverlayClick={false} isOpen={isOpen3} onClose={onClose3}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete medicine</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                Are you sure delete this medicine?
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={callDeleteMedicineAPI}>
                  Delete
                </Button>
                <Button onClick={onClose3}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>

      <div className=''>
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

    </div>
  )
}
