import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ViewHospitalization() {
    const navigate = useNavigate()
    const { id } = useParams()
    const hospitalizationId = parseInt(id, 10)  //Chuyển từ string sang int
    const [hospitalization, setHospitalization] = useState()
    const roleId = localStorage.getItem("roleId")

    const loadHospitalization = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hospitalization/${hospitalizationId}`, { withCredentials: true })
            if (response.data.message === "Successfully") {
                setHospitalization(response.data.hospitalization)
            } else {
                toast.warning(response.data.message)
            }
        } catch (e) {
            toast.error(e.message)
            setTimeout(() => {
                navigate('/404page')
            }, 2000);
        }
    }

    useEffect(() => {
        loadHospitalization()
    }, [])

    return (
        <div className='container my-3 bg-white shadow' style={{ height: '95%' }}>
            <div className='row'>
                <h1 className='text-center fs-4 col-8 mx-auto'>Hospitalization: {id}</h1>
                {roleId === '3' ? (
                    hospitalization?.status !== "discharged" &&
                    <Link className='btn btn-success col-1 shadow'>Update</Link>
                ) : (
                    ""
                )}
            </div>
            <div className='row cage-and-pet-info text-center'>
                <div className='cage col-6'>
                    <div className='row '>
                        <div className='col-11 mx-4 fs-5 border border-end-0 border-start-0 border-top-0 border-dark'>Cage Information</div>
                    </div>
                    <div className='row fs-6 my-2'>
                        <div className='col-6'>
                            Name: {hospitalization?.cage?.name}
                        </div>
                        <div className='col-6'>
                            Price: {hospitalization?.cage?.price?.toLocaleString("vi-Vn") + " VND"}
                        </div>
                    </div>
                </div>
                <div className='pet col-6'>
                    <div className='row'>
                        <div className='col-11 mx-4 fs-5 border border-end-0 border-start-0 border-top-0 border-dark'>Pet Information</div>
                    </div>
                    <div className='row fs-6 my-2'>
                        <div className='col-6'>
                            Name: {hospitalization?.pet?.name}
                        </div>
                        <div className='col-6'>
                            Owner: {hospitalization?.pet?.owner?.fullName}
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                {hospitalization?.hospitalizationDetails?.map((hospitalizationDetail, index) => {

                })}
            </div>
        </div>
    )
}
