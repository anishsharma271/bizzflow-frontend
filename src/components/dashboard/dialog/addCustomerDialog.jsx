import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { createCustomer, createTransaction } from '../../../store/dashboard/dashboardSlice';

const customerSchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
});

const activitySchema = yup.object().shape({
  type: yup.string().oneOf(['CREDIT', 'DEBIT']).required('Transaction type is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  description: yup.string().optional(),
});

const DynamicDialog = ({ mode = 'customer', onClose, customer }) => {
  const dispatch = useDispatch();

  const isCustomer = mode === 'customer';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: isCustomer
      ? { name: '', phone: '' }
      : { type: 'CREDIT', amount: '', description: '' },
    resolver: yupResolver(isCustomer ? customerSchema : activitySchema)
  });

  const phone = watch('phone');

  const onSubmit = async (data) => {
    if (isCustomer) {
      await dispatch(createCustomer(data));
    } else {
      const payload = {
        customerId: customer.id,
        ...data
      };
      await dispatch(createTransaction(payload));
    }

    reset();
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isCustomer ? 'Add New Customer' : `Add Activity for ${customer?.name}`}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {isCustomer ? (
            <>
              {/* Name Field */}
              <div style={{ marginBottom: '10px' }}>
                <input
                  {...register('name')}
                  placeholder="Full Name*"
                  style={{
                    width: '95%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '6px'
                  }}
                />
                {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
              </div>

              {/* Phone Field */}
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  {...register('phone')}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setValue('phone', val);
                  }}
                  maxLength={10}
                  placeholder="Phone Number*"
                  style={{
                    width: '100%',
                    padding: '10px 0px 10px 5px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    border: errors.phone ? '2px solid red' : '1px solid #ccc',
                  }}
                />
                {errors.phone && (
                  <p style={{ color: 'red', marginTop: '4px' }}>{errors.phone.message}</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Type Field */}
              <div style={{ marginBottom: '10px' }}>
                <select
                  {...register('type')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '6px',
                  }}
                >
                  <option value="CREDIT">Credit (Payment)</option>
                  <option value="DEBIT">Debit (Supply)</option>
                </select>
                {errors.type && <p style={{ color: 'red' }}>{errors.type.message}</p>}
              </div>

              {/* Amount Field */}
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="number"
                  {...register('amount')}
                  placeholder="Amount*"
                  style={{
                    width: '95%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '6px'
                  }}
                />
                {errors.amount && (
                  <p style={{ color: 'red' }}>{errors.amount.message}</p>
                )}
              </div>

              {/* Description Field */}
              <div style={{ marginBottom: '10px' }}>
                <textarea
                  {...register('description')}
                  placeholder="Description (optional)"
                  style={{
                    width: '95%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '6px',
                  }}
                />
              </div>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isCustomer ? 'Add Customer' : 'Add Activity'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DynamicDialog;
