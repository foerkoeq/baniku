// start of frontend/components/alerts/Alert.tsx
import React from 'react';
import IconX from '@/components/icon/icon-x';

interface AlertProps {
    children: React.ReactNode;
    type?: 'default' | 'outline' | 'solid' | 'arrowed' | 'custom' | 'error' | 'info';
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark';
    icon?: React.ReactElement;
    iconPosition?: 'left' | 'right';
    closeBtn?: boolean;
    gradient?: {
        from: string;
        to: string;
    };
    backgroundImage?: string;
    rounded?: boolean;
    customContent?: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

const Alert: React.FC<AlertProps> = ({
    children,
    type = 'default',
    color = 'primary',
    icon,
    iconPosition = 'left',
    closeBtn = false,
    gradient,
    backgroundImage,
    rounded = true,
    customContent,
    onClose,
    className = '',
    ...props
}) => {
    // Menyesuaikan warna berdasarkan tipe
    if (type === 'error') {
        color = 'danger';
    } else if (type === 'info') {
        color = 'info';
    }

    // Menerjemahkan tipe 'error' dan 'info' ke tipe yang didukung
    const mappedType = type === 'error' || type === 'info' ? 'default' : type;

    // Base classes
    let baseClasses = 'flex items-center p-3.5';
    if (rounded) baseClasses += ' rounded';

    // Alert type classes
    const getTypeClasses = () => {
        switch (mappedType) {
            case 'outline':
                return `text-white-dark border border-${color}`;
            case 'solid':
                return `text-white bg-${color}`;
            case 'arrowed':
                return `relative text-${color} bg-${color}-light border !border-${color} ${
                    iconPosition === 'left' ? 'ltr:border-l-[64px] rtl:border-r-[64px]' : 'ltr:border-r-[64px] rtl:border-l-[64px]'
                } dark:bg-${color}-dark-light before:absolute before:top-1/2 before:-mt-2 ${
                    iconPosition === 'left'
                        ? 'ltr:before:left-0 rtl:before:right-0 rtl:before:rotate-180 before:border-l-8'
                        : 'ltr:before:right-0 rtl:before:left-0 rtl:before:rotate-180 before:border-r-8'
                } before:border-t-8 before:border-b-8 before:border-t-transparent before:border-b-transparent before:border-${
                    iconPosition === 'left' ? 'l' : 'r'
                }-inherit`;
            case 'custom':
                if (gradient) {
                    return `text-white bg-gradient-to-r from-[${gradient.from}] to-[${gradient.to}]`;
                }
                if (backgroundImage) {
                    return 'text-white bg-no-repeat bg-center bg-cover';
                }
                return 'text-white bg-info';
            default:
                return `text-${color} bg-${color}-light dark:bg-${color}-dark-light`;
        }
    };

    // Icon classes
    const getIconClasses = () => {
        if (mappedType === 'arrowed') {
            return `absolute inset-y-0 text-white w-6 h-6 m-auto ${
                iconPosition === 'left' ? 'ltr:-left-11 rtl:-right-11' : 'ltr:-right-11 rtl:-left-11'
            }`;
        }
        return `text-white w-6 h-6 ${iconPosition === 'left' ? 'ltr:mr-4 rtl:ml-4' : 'ltr:ml-4 rtl:mr-4'}`;
    };

    // Style for background image
    const bgStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {};

    return (
        <div className={`${baseClasses} ${getTypeClasses()} ${className}`} style={bgStyle} {...props}>
            {icon && <span className={getIconClasses()}>{icon}</span>}
            
            <span className="ltr:pr-2 rtl:pl-2">
                {children}
            </span>

            {customContent}

            {closeBtn && (
                <button 
                    type="button" 
                    className="hover:opacity-80 ltr:ml-auto rtl:mr-auto" 
                    onClick={onClose}
                >
                    <IconX className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export default Alert;

// end of frontend/components/alerts/Alert.tsx