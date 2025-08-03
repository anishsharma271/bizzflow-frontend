import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerData } from '../../store/dashboard/dashboardSlice';
import { Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './style.css';

const AddCustomerDialog = React.lazy(() => import('./dialog/addCustomerDialog'));
const CustomerList = React.lazy(() => import('./customer/customerList'));

const Home = () => {
    const dispatch = useDispatch();

    // 🧠 Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [dialogMode, setDialogMode] = useState(null); 


    const { data } = useSelector((state) => state.dashboardSlice);
    const { customerData = [], message, total = 0 } = data || {};

    // 📦 Fetch data when page or limit changes
    useEffect(() => {
        dispatch(getCustomerData({ page, limit }));
    }, [page, limit]);

    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (_, newPage) => {
        setPage(newPage);
    };

    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setPage(1);
    };
    const openAddCustomer = () => {
  setDialogMode('customer');
  setSelectedCustomer(null);
};

const openAddActivity = (cust) => {
  setDialogMode('activity');
  setSelectedCustomer(cust);
};


    return (
        <div className="container  home-container">

            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4 position-relative">
                <h2 className="text-xl font-bold text-white">Customer Dashboard</h2>
                <button
                    onClick={openAddCustomer}
                    className="btn btn-primary position-absolute"
                >
                    ➕ Add Customer
                </button>
            </div>



            {Array.isArray(customerData) && customerData.length > 0 ? (
                <div className="row  d-flex justify-content-center align-item-center w-100">
                    {customerData.map((customer) => (
                        <div className="col-md-3" key={customer.id}>
                            <CustomerList customer={customer} onAddActivity={openAddActivity} />
                        </div>
                    ))}



                    <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
                        {/* Limit Selection */}
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Rows per page</InputLabel>
                            <Select value={limit} label="Rows per page" onChange={handleLimitChange}>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Page Navigation */}
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            shape="rounded"
                        />
                    </div>
                </div>
            ) : (
                <h2 className="text-gray-500">{message || 'No customers found'}</h2>
            )}

            {/* Add Customer Popup */}
            {/* {openDialog && <AddCustomerDialog onClose={() => setOpenDialog(false)} />} */}
                {dialogMode && (
  <AddCustomerDialog
    mode={dialogMode}
    customer={selectedCustomer}
    onClose={() => {
      setDialogMode(null);
      setSelectedCustomer(null);
    }}
  />
)}

        </div>
    );
};

export default Home;
