import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Routes, Route, useParams } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";
export default function PaymentResult() {
  // let status = useParams();
  // console.log(status);
  function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
   let query = useQuery();
   let status = query.get("status")
   let orderCode = query.get("orderCode")
   console.log(status)
   console.log(orderCode)
   const [payment, setPayment] = useState(undefined)
  const [isLoading, setIsLoading] = useState(true);
    
  useEffect(() => {
    // Simulate an API call
    console.log('hihihihihi')
    if(status && orderCode){
      console.log('run api')
      axios.put('http://localhost:8080/payment-update', {
        orderCode,
        status
      }).then((res) => {
        setPayment(res.data.data)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        alert(error?.response?.data?.errorMessage ?? error?.message);
      })
    }
  }, [status, orderCode]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Fragment>
 { payment && <div>
  { payment.status === 'CANCELLED' && <div>Payment CANCELLED</div> }
  { payment.status === 'PAID' && <div>Payment PAID</div> }
 </div>  }
    </Fragment>
   
  )
}
