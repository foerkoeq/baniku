// start of frontend/components/ui/Modal.tsx
'use client';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import IconX from '@/components/icon/icon-x';

interface ModalProps {
  id?: string;
  open?: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  position?: 'top' | 'center';
  animation?: 
    'slideInDown' | 
    'slideInUp' | 
    'fadeIn' |
    'fadeInLeft' | 
    'fadeInRight' | 
    'zoomIn' | 
    'rotateInLeft' |
    'rotateInRight' | 
    'none';
  footer?: React.ReactNode;
  preventClose?: boolean;
  closeIcon?: boolean;
  type?: 'default' | 'profile' | 'tabs' | 'video';
  showBackground?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  id,
  open = false, 
  onClose,
  title,
  children,
  className = '',
  size = 'md',
  position = 'top',
  animation = 'fadeIn',
  footer,
  preventClose = false,
  closeIcon = true,
  type = 'default',
  showBackground = true,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-5xl',
    'full': 'max-w-full'
  }[size];

  // Position classes  
  const positionClasses = position === 'center' ? 'items-center' : 'items-start';

  // Animation classes
  const getAnimationClasses = () => {
    switch(animation) {
      case 'fadeIn':
        return 'animate__animated animate__fadeIn';
      case 'fadeInLeft':
        return 'animate__animated animate__fadeInLeft'; 
      case 'fadeInRight':
        return 'animate__animated animate__fadeInRight';
      case 'slideInDown':
        return 'animate__animated animate__slideInDown';
      case 'slideInUp':
        return 'animate__animated animate__slideInUp';
      case 'zoomIn':
        return 'animate__animated animate__zoomIn';
      case 'rotateInLeft':
        return 'animate__animated animate__rotateInDownLeft';
      case 'rotateInRight':
        return 'animate__animated animate__rotateInDownRight';
      case 'none':
        return '';
      default:
        return 'animate__animated animate__fadeIn';
    }
  };

  const handleClose = () => {
    if (!preventClose) {
      onClose();
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'profile':
        return (
          <div className="bg-secondary dark:bg-secondary p-0">
            {closeIcon && (
              <div className="flex items-center justify-end pt-4 ltr:pr-4 rtl:pl-4 text-white dark:text-white-light">
                <button onClick={handleClose} className="text-white-dark hover:text-dark">
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-5">
              {children}
            </div>
          </div>
        );

      case 'tabs':
        return (
          <>
            <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
              <h5 className="text-lg font-bold">{title}</h5>
              {closeIcon && (
                <button onClick={handleClose} className="text-white-dark hover:text-dark">
                  <IconX className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-5">
              {children}
              {footer && <div className="mt-8 flex items-center justify-end">{footer}</div>}
            </div>
          </>
        );

      case 'video':
        return (
          <div className="p-5">
            {closeIcon && (
              <div className="text-right mb-3">
                <button onClick={handleClose} className="text-white-dark hover:text-dark">
                  <IconX className="w-5 h-5" />  
                </button>
              </div>
            )}
            {children}
          </div>
        );

      default:
        return (
          <>
            <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
              <h5 className="text-lg font-bold">{title}</h5>
              {closeIcon && (
                <button onClick={handleClose} className="text-white-dark hover:text-dark">
                  <IconX className="w-5 h-5" />
                </button>
              )}  
            </div>
            <div className="p-5">
              {children}
              {footer && <div className="mt-8 flex items-center justify-end">{footer}</div>}
            </div>
          </>
        );
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" open={open} onClose={handleClose} id={id}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0" />
        </TransitionChild>
        <div className={`fixed inset-0 z-[999] overflow-y-auto ${showBackground ? 'bg-[black]/60' : ''}`}>
          <div className={`flex min-h-screen px-4 ${positionClasses}`}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className={`
                panel my-8 w-full overflow-hidden rounded-lg border-0 p-0
                ${type !== 'video' ? 'text-black dark:text-white-dark' : ''}
                ${sizeClasses}
                ${getAnimationClasses()}
                ${className}
              `}>
                {renderContent()}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
// end of frontend/components/ui/Modal.tsx