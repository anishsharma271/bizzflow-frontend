import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

const toasterOptions = {
  success: {
    style: {
      background: '#4caf50',
      color: '#fff',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#4caf50',
    },
  },
  error: {
    style: {
      background: '#f44336',
      color: '#fff',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#f44336',
    },
  },
};

 const ToastContainer = () => (
  <Toaster
    position="top-center"
    toastOptions={toasterOptions}
    containerStyle={{
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
    }}
  />
);

// 🔥 Call these from anywhere in your project
export const showToast = ({ type = 'success', message }) => {
  if (type === 'success') toast.success(message);
  else if (type === 'error') toast.error(message);
  else toast(message);
};

export const showPromiseToast = (promiseFn, msgs = {}) =>
  toast.promise(promiseFn, {
    loading: msgs.loading || 'Loading...',
    success: msgs.success || 'Success!',
    error: msgs.error || 'Something went wrong!',
  });

  export default ToastContainer;