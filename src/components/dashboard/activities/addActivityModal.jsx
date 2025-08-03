import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

const schema = yup.object().shape({
  type: yup.string().oneOf(['supply', 'payment']).required(),
  amount: yup.number().positive('Amount must be positive').required('Amount is required')
});

const AddActivityModal = ({ customerId, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`/api/transactions`, {
        customerId,
        ...data
      });
      onClose(); // you can trigger a refresh if needed
    } catch (err) {
      console.error("Failed to add transaction", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-80 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Add Activity</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Type</label>
            <select {...register('type')} className="w-full border p-2 rounded">
              <option value="">Select</option>
              <option value="supply">Supply</option>
              <option value="payment">Payment</option>
            </select>
            <p className="text-red-500 text-sm">{errors.type?.message}</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Amount</label>
            <input
              {...register('amount')}
              type="number"
              placeholder="Enter amount"
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.amount?.message}</p>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;
