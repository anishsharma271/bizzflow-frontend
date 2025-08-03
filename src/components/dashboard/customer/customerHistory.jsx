import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Divider,
    Pagination,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerTransactionHistory } from '../../../store/dashboard/dashboardSlice';

const CustomerHistory = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.dashboardSlice);
    console.log(",data.customerTransactionHistory",data.customerTransactionHistory);
    
    const transactions = data?.customerTransactionHistory?.data || [];
    const totalTransactions = data.customerTransactionHistory?.total || 0;
    console.log("transactions", transactions);
    console.log("totalTransactions    ", totalTransactions);

    const totalPages = Math.ceil(totalTransactions / limit);


    useEffect(() => {
        dispatch(getCustomerTransactionHistory({ page, limit, customer_id: id })).unwrap()
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [dispatch, page, id]);

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                Transaction History
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {transactions.length === 0 ? (
                        <Typography>No transactions found.</Typography>
                    ) : (
                        transactions.map((tx) => (
                            <Card
                                key={tx.id}
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    borderLeft: `6px solid ${tx.type === 'supply' ? '#f44336' : '#4caf50'}`,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography fontWeight="bold">
                                            {tx.type === 'supply' ? 'Supplied' : 'Paid'} ₹{tx.amount}
                                        </Typography>
                                        <Chip
                                            label={tx.type.toUpperCase()}
                                            color={tx.type === 'supply' ? 'error' : 'success'}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        {moment(tx.created_at).format('DD MMM YYYY, hh:mm A')}
                                    </Typography>
                                    {tx.note && (
                                        <Typography variant="body2" mt={0.5}>
                                            Note: {tx.note}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}

                    <Box mt={3} display="flex" justifyContent="center">
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default CustomerHistory;
