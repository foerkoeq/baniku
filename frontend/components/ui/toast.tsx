// start of frontend/components/ui/Toast.tsx
'use client';
import { transition } from 'd3';
import React from 'react';
import { ToastContainer, toast, ToastPosition, TypeOptions, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Tipe-tipe notifikasi yang tersedia
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Interface untuk konfigurasi toast yang meng-extend dari ToastOptions
interface ToastOptions {
    position?: ToastPosition;
    autoClose?: number;
    hideProgressBar?: boolean;
    closeOnClick?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    progress?: number;
}

// Komponen Container untuk Toast
export const Toast: React.FC = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
};

// Fungsi helper untuk menampilkan toast
export const showToast = (
    type: ToastType,
    message: string,
    options?: ToastOptions
) => {
    const defaultOptions: ToastOptions = {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options
    };

    switch (type) {
        case 'success':
            toast.success(message, defaultOptions);
            break;
        case 'error':
            toast.error(message, defaultOptions);
            break;
        case 'info':
            toast.info(message, defaultOptions);
            break;
        case 'warning':
            toast.warning(message, defaultOptions);
            break;
        default:
            toast(message, defaultOptions);
    }
};

// Fungsi helper untuk toast loading
export const showLoadingToast = (message: string = 'Memuat...') => {
    return toast.loading(message, {
        position: 'top-right' as ToastPosition
    });
};

// Fungsi untuk mengupdate toast loading
export const updateLoadingToast = (
    toastId: string | number,
    type: ToastType,
    message: string,
    options?: ToastOptions
) => {
    const defaultOptions = {
        position: 'top-right' as ToastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options
    };

    toast.update(toastId, {
        render: message,
        type: type as TypeOptions,
        isLoading: false,
        ...defaultOptions
    });
};

// Fungsi untuk menghapus toast
export const dismissToast = (toastId?: string | number) => {
    if (toastId) {
        toast.dismiss(toastId);
    } else {
        toast.dismiss();
    }
};

export default Toast;
// end of frontend/components/ui/Toast.tsx