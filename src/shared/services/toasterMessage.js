import toast from 'react-hot-toast';

/**
 * Global configurations for toasts
 */
const toastOptions = {
  position: 'top-right',
  duration: 4000,
  style: {
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
  },
};

/**
 * Reusable Toast Service
 */
export const toastService = {
  // Success notification
  success: (message) => {
    toast.success(message, {
      ...toastOptions,
      style: { ...toastOptions.style, background: '#ECFDF5', color: '#065F46' },
    });
  },

  // Error notification
  error: (message) => {
    toast.error(message || 'An unexpected error occurred.', {
      ...toastOptions,
      style: { ...toastOptions.style, background: '#FEF2F2', color: '#991B1B' },
    });
  },

  // Informational notification
  info: (message) => {
    toast(message, {
      ...toastOptions,
      icon: 'ℹ️',
      style: { ...toastOptions.style, background: '#EFF6FF', color: '#1E40AF' },
    });
  },

  // Promise/Async operation tracker
  promise: (asyncFunction, loadingMsg = 'Loading...', successMsg = 'Done!', errorMsg = 'Failed!') => {
    return toast.promise(
      asyncFunction,
      {
        loading: loadingMsg,
        success: successMsg,
        error: errorMsg,
      },
      toastOptions
    );
  },

  // Programmatically dismiss all active toasts
  dismissAll: () => {
    toast.dismiss();
  }
};
