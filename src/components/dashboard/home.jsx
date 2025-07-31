import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerData } from '../../store/dashboard/dashboardSlice';

const Home = () => {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.dashboardSlice);
    console.log(`Customer Data:`, data);
    const { customerData, message } = data;
    useEffect(() => {
        dispatch(getCustomerData());
    }, []);
    return (
        <div>
            { Array.isArray(customerData) && customerData.length > 0 ? ("") : <h2>{message}</h2>}
        </div>
    )
}

export default Home
