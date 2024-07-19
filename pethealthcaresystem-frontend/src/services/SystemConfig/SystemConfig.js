import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons'
import { Button, FormControl, Modal, ModalCloseButton, ModalContent, ModalOverlay, Select, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import '../Medicine/Medicine.css'
import ReactPaginate from 'react-paginate'
import { URL } from '../../utils/constant'
export default function SystemConfig() {
    const navigate = useNavigate()
    const { isOpen: isOpenAddConfig, onOpen: onOpenAddConfig, onClose: onCloseAddConfig } = useDisclosure()

    const [configurations, setConfigurations] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [selectedKey2, setSelectedKey2] = useState("")
    const pageSize = 10

    const handlePageClick = (data) => {
        // console.log(data.selected)
        setCurrentPage(data.selected)
    }

    const [configuration, setConfiguration] = useState({
        configKey: '',
        configValue: '',
    })
    const addConfig = async () => {
        if (configuration.configKey === "" || configuration.configKey === null) {
            toast.info("Please choose configuration you want to add!")
            return
        }
        if (configuration.configValue === "" || configuration.configValue === null) {
            toast.info("Please enter value you want to add!")
            return
        }
        try {
            const response = await axios.post(`${URL}/configuration/add`, configuration, { withCredentials: true })
            if (response.data.message === 'Successfully') {
                toast.success('Add config success')
            } else {
                toast.warning(response.data.message)
            }
        } catch (e) {
            // console.log(e)
            navigate('/404page')
        }
    }

    const [selectedKey, setSelectedKey] = useState("All")
    useEffect(() => {
        const fetchConfigurationsByKey = async (key, page) => {
            try {
                const response = await axios.get(`${URL}/configuration/search/${key}?page=${page}&size=${pageSize}`, { withCredentials: true })
                if (response.data.message === 'Successfully') {
                    setConfigurations(response.data.configurations.content)
                    setTotalPages(response.data.configurations.totalPages)
                } else {
                    toast.warning(response.data.message)
                }
            } catch (e) {
                navigate('/404page')
            }
        }
        fetchConfigurationsByKey(selectedKey, currentPage)
    }, [selectedKey, currentPage])

    const [selectedConfig, setSelectedConfig] = useState()
    const { isOpen: isOpenEditConfig, onOpen: onOpenEditConfig, onClose: onCloseEditConfig } = useDisclosure()
    const hanldeEditSConfig = async (config) => {
        try {
            const response = await axios.put(`${URL}/configuration/update/${config?.id}`, config, { withCredentials: true })
            if (response.data.message === 'Successfully') {
                toast.success("Updated Successs")
                window.location.reload()
            } else {
                toast.warning(response.data.message)
            }
        } catch (e) {
            // console.log(e)
            navigate('/404page')
        }
    }

    const handleDeleteSConfig = async (config) => {
        try {
            const response = await axios.delete(`${URL}/configuration/${config?.id}`, { withCredentials: true })
            if (response.data.message === 'Deleted') {
                toast.success("Delete Successs")
                window.location.reload()
            } else {
                toast.warning(response.data.message)
            }
        } catch (e) {
            // console.log(e)
            navigate('/404page')
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='mt-3 d-flex justify-content-between'>
                    <div className='d-flex'>
                        <Button colorScheme='teal' width={350} style={{ marginRight: '15px' }} onClick={onOpenAddConfig}>Add New SystemConfiguration</Button>
                        <Modal isOpen={isOpenAddConfig} onClose={onCloseAddConfig} size={'xl'}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader className='fw-bold text-center my-3 justify-content-center fs-5'>Add New Configuration</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody pb={6} >
                                    <div className="form-floating mb-3 mx-3">
                                        <Select placeholder='Choose Config' onChange={(e) => {
                                            // setSelectedKey2(e.target.value ? e.target.value : "")
                                            setConfiguration((prev) => ({ ...prev, configKey: e.target.value }))
                                        }}>
                                            <option value="petType">Pet Type</option>
                                            <option value="medicineUnit">Medicine Unit</option>
                                        </Select>
                                    </div>
                                    {/* <div className="form-floating mb-3 mx-3">
                                        <input type="text" readOnly className="form-control" id="configKey"
                                            value={configuration.configKey} />
                                        <label htmlFor="configKey">Enter Config Key</label>
                                    </div> */}
                                    <div className="form-floating mb-3 mx-3">
                                        <input type="text" className="form-control" id="configValue"
                                            onChange={(e) => setConfiguration((prev) => ({ ...prev, configValue: e.target.value }))} required />
                                        <label htmlFor="configValue">Enter new config value</label>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button colorScheme='teal' mr={3} onClick={addConfig} mb={3}>
                                        Save
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                        <FormControl className='rounded shadow w-50'>
                            <Select placeholder='Find By Key' onChange={(e) => {
                                setSelectedKey(e.target.value ? e.target.value : "All")
                            }}>
                                <option value="petType">Pet Type</option>
                                <option value="medicineUnit">Medicine Unit</option>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <div>
                    <table className="table table-hover shadow mt-5">
                        <thead >
                            <tr className='text-center '>
                                <th className="col-1"> No</th>
                                <th className="col-2">Config Key</th>
                                <th className="col-3">Config value</th>
                                <th className='col-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configurations?.map((configuration, index) => (
                                <tr key={index} className='text-center item'>
                                    <td>{index + 1}</td>
                                    <td>{configuration.configKey}</td>
                                    <td>{configuration.configValue}</td>
                                    <td className=''>
                                        <span style={{ marginRight: '16px' }} className='icon-container'>
                                            <EditIcon style={{ color: 'teal', cursor: 'pointer' }} onClick={() => {
                                                onOpenEditConfig()
                                                setSelectedConfig(configuration)
                                            }} />
                                            <span className="icon-text">Edit</span>
                                        </span>
                                        <span className='icon-container'>
                                            <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteSConfig(configuration)} />
                                            <span className="icon-text">Delete</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Modal isOpen={isOpenEditConfig} onClose={onCloseEditConfig} size={'xl'}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader className='fw-bold text-center my-3 justify-content-center fs-5'>Edit Configuration</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6} >
                                <div className="form-floating mb-3 mx-3">
                                    <input type="text" className="form-control" id="configKey"
                                        value={selectedConfig?.configKey}
                                        onChange={(e) => setSelectedConfig((prev) => ({ ...prev, configKey: e.target.value }))} required />
                                    <label htmlFor="configKey">Enter Config value</label>
                                </div>
                                <div className="form-floating mb-3 mx-3">
                                    <input type="text" className="form-control" id="configValue"
                                        value={selectedConfig?.configValue}
                                        onChange={(e) => setSelectedConfig((prev) => ({ ...prev, configValue: e.target.value }))} required />
                                    <label htmlFor="configValue">Enter Config value</label>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme='teal' mr={3} onClick={() => {
                                    onCloseEditConfig();
                                    hanldeEditSConfig(selectedConfig)
                                }} mb={3}>
                                    Save
                                </Button>
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
