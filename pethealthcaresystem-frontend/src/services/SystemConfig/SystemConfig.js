import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons'
import { Button, FormControl, Modal, ModalCloseButton, ModalContent, ModalOverlay, Select, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import '../Medicine/Medicine.css'
import ReactPaginate from 'react-paginate'

export default function SystemConfig() {
    const navigate = useNavigate()
    const { isOpen: isOpenAddConfig, onOpen: onOpenAddConfig, onClose: onCloseAddConfig } = useDisclosure()

    const [configurations, setConfigurations] = useState([])
    useEffect(() => {
        //Lấy all configurations lên để hiển thị
        const fetchConfiguration = async () => {
            try {
                const respone = await axios.get('http://localhost:8080/configurations', { withCredentials: true })
                console.log(respone.data)
                if (respone.data.message === 'Successfully') {
                    setConfigurations(respone.data.configurations)
                } else {
                    toast.info(respone.data.message)
                }
            } catch (error) {
                console.log(error)
                // navigate('/404page')
            }
        }
        fetchConfiguration();
    }, [])
    return (
        <div className='container'>
            <div className='row'>
                <div className='mt-3 d-flex justify-content-between'>
                    <div className='d-flex'>
                        <Button colorScheme='teal' width={350} style={{ marginRight: '15px' }} onClick={onOpenAddConfig}>Add New SystemConfiguration</Button>
                        <Modal isOpen={isOpenAddConfig} onClose={onCloseAddConfig} size={'xl'}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Add New Configuration</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody pb={6} >

                                </ModalBody>
                                <ModalFooter>

                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                        <FormControl className='rounded shadow w-50'>
                            <Select placeholder='Find By Key'>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="search-container rounded shadow">
                        <div className="search-wrapper">
                            <SearchIcon boxSize={6} style={{ marginRight: '8px', marginLeft: '5px' }} className='search-icon' />
                            <input
                                className='rounded text-center fst-italic border-0'
                                style={{ height: '2rem', width: '14rem', outline: 'none' }}
                                placeholder='Search medicine'
                            />
                        </div>
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
                                <tr className='text-center item'>
                                    <td>{index + 1}</td>
                                    <td>{configuration.configKey}</td>
                                    <td>{configuration.configValue}</td>
                                    <td className=''>
                                        <span style={{ marginRight: '16px' }} className='icon-container'>
                                            <EditIcon style={{ color: 'teal', cursor: 'pointer' }} />
                                            <span className="icon-text">Edit</span>

                                        </span>
                                        <span className='icon-container'>
                                            <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} />
                                            <span className="icon-text">Delete</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className=''>
                <ReactPaginate style={{ background: 'teal' }}
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    // pageCount={totalPages}
                    pageCount={2}   //Test
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    // onPageChange={handlePageClick}
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
