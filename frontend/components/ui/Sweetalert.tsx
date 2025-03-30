// start of frontend/components/ui/Sweetalert.tsx
'use client';
import React from 'react';
import Swal from 'sweetalert2';

type AlertType = 
    | 'basic' 
    | 'withFooter'
    | 'success'
    | 'warning'
    | 'question'
    | 'error'
    | 'custom'
    | 'autoClose'
    | 'html'
    | 'customImage'
    | 'customStyle'
    | 'queue'
    | 'customAnimation'
    | 'dynamic'
    | 'rtl'
    | 'mixin';

interface SweetAlertProps {
    type?: AlertType;
    title?: string;
    text?: string;
    html?: string;
    icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    timer?: number;
    timerProgressBar?: boolean;
    padding?: string | number;
    customClass?: {
        container?: string;
        popup?: string;
        header?: string;
        title?: string;
        closeButton?: string;
        icon?: string;
        image?: string;
        content?: string;
        input?: string;
        actions?: string;
        confirmButton?: string;
        cancelButton?: string;
        footer?: string;
    };
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number | 'auto';
    background?: string;
    position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end';
    onConfirm?: (result: any) => void;
    onCancel?: () => void;
    steps?: string[];
    reverseButtons?: boolean;
    showCloseButton?: boolean;
}

const SweetAlert = {
    fire: async (props: SweetAlertProps) => {
        const { type = 'basic', onConfirm, onCancel, steps, ...rest } = props;

        const baseConfig = {
            padding: '2em',
            customClass: { popup: 'sweet-alerts' },
            ...rest
        };

        const showBasicAlert = () => {
            return Swal.fire(baseConfig);
        };

        const showAutoCloseAlert = () => {
            let timerInterval: any;
            return Swal.fire({
                ...baseConfig,
                timer: 2000,
                timerProgressBar: true,
                html: 'I will close in <b></b> milliseconds.',
                didOpen: () => {
                    const b: any = Swal.getHtmlContainer()?.querySelector('b');
                    timerInterval = setInterval(() => {
                        b.textContent = Swal.getTimerLeft();
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                },
            });
        };

        const showWarningAlert = async () => {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-secondary',
                    cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
                    popup: 'sweet-alerts',
                },
                buttonsStyling: false,
            });
            
            const result = await swalWithBootstrapButtons.fire({
                ...baseConfig,
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
            });

            if (result.value) {
                swalWithBootstrapButtons.fire('Deleted!', 'Your file has been deleted.', 'success');
                onConfirm?.(result.value);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
                onCancel?.();
            }
        };

        const showChainedAlerts = async () => {
            const swalQueueStep = Swal.mixin({
                progressSteps: steps,
                confirmButtonText: 'Next →',
                showCancelButton: true,
                input: 'text',
                inputAttributes: {
                    required: 'true',
                },
                validationMessage: 'This field is required',
                ...baseConfig
            });

            const values: any = [];
            let currentStep;

            for (currentStep = 0; currentStep < (steps?.length || 0);) {
                const result = await swalQueueStep.fire({
                    title: `Question ${steps?.[currentStep]}`,
                    inputValue: values[currentStep],
                    showCancelButton: currentStep > 0,
                    currentProgressStep: currentStep,
                });

                if (result.value) {
                    values[currentStep] = result.value;
                    currentStep++;
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    currentStep--;
                } else {
                    break;
                }
            }

            if (currentStep === steps?.length) {
                Swal.fire({
                    title: 'All done!',
                    html: 'Your answers: <pre>' + JSON.stringify(values) + '</pre>',
                    confirmButtonText: 'Lovely!',
                    ...baseConfig
                });
                onConfirm?.(values);
            }
        };

        const showToastMixin = () => {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });

            return toast.fire({
                icon: 'success',
                title: 'Signed in successfully',
                padding: '10px 20px',
            });
        };

        const showCustomAnimation = () => {
            return Swal.fire({
                ...baseConfig,
                showClass: {
                    popup: 'animate__animated animate__flip'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
        };

        switch (type) {
            case 'autoClose':
                return showAutoCloseAlert();
            case 'warning':
                return showWarningAlert();
            case 'queue':
                return showChainedAlerts();
            case 'mixin':
                return showToastMixin();
            case 'customAnimation':
                return showCustomAnimation();
            default:
                return showBasicAlert();
        }
    }
};

export default SweetAlert;
// end of frontend/components/ui/Sweetalert.tsx