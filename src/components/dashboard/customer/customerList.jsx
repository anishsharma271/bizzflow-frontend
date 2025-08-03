import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Box,
  Button,
} from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CustomerList = ({ customer, onAddActivity }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        minHeight: 220,
        borderRadius: 3,
        boxShadow: 3,
        transition: '0.3s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: '#f44336', mr: 2 }}>
            {customer.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" noWrap>
              {customer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Balance: ₹{customer.balance}
            </Typography>
          </Box>
        </Box>

        {/* Stats */}
        <Box display="flex" justifyContent="space-between" mb={1} gap={3}>
          <Box display="flex" alignItems="center" color="red">
            <ArrowUpward fontSize="small" />
            <Typography ml={0.5} fontSize={14}>
              Supply: ₹{customer.totalSupply}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" color="green">
            <ArrowDownward fontSize="small" />
            <Typography ml={0.5} fontSize={14}>
              Payment: ₹{customer.totalPayment}
            </Typography>
          </Box>
        </Box>

        <Typography mt={1} fontWeight="bold" style={{ color: '#131111ff' , textAlign: 'center' }}>
          Net Balance: ₹{customer.balance}
        </Typography>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/customer/${customer.id}/history`)}
          >
            View History
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => onAddActivity(customer)}
          >
            Add Activity
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
