// start of frontend/components/buttons/Button.tsx
// import { IconType } from '@/types'; // Removed as it is not used
import React from 'react';

interface ButtonProps {
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'solid' | 'outline';
    color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'secondary' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    rounded?: boolean;
    block?: boolean;
    icon?: React.ReactElement;
    iconPosition?: 'left' | 'right';
    className?: string;
    loading?: boolean;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    variant = 'solid',
    color = 'primary',
    size = 'md',
    rounded = false,
    block = false,
    icon,
    iconPosition = 'left',
    className = '',
    loading = false,
    disabled = false,
    onClick,
    ...props
}) => {
    // Base classes
    const baseClasses = 'btn';
    
    // Variant classes
    const variantClasses = variant === 'outline' ? `btn-outline-${color}` : `btn-${color}`;
    
    // Size classes
    const sizeClasses = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg'
    }[size];
    
    // Shape classes
    const shapeClasses = rounded ? 'rounded-full' : '';
    
    // Block classes
    const blockClasses = block ? 'w-full' : '';
    
    // Disabled/Loading state
    const stateClasses = (disabled || loading) ? 'opacity-60 cursor-not-allowed' : '';

    // Icon only classes (square button)
    const iconOnlyClasses = !children && icon ? 'p-0 w-10 h-10' : '';

    // Combine all classes
    const combinedClasses = `
        ${baseClasses} 
        ${variantClasses} 
        ${sizeClasses} 
        ${shapeClasses} 
        ${blockClasses} 
        ${stateClasses}
        ${iconOnlyClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    // Render icon with position
    const renderIcon = () => {
        if (!icon) return null;
        
        const iconElement = React.cloneElement(icon, {
            className: `h-5 w-5 shrink-0 ${
                children
                    ? iconPosition === 'left'
                        ? 'ltr:mr-1.5 rtl:ml-1.5'
                        : 'ltr:ml-1.5 rtl:mr-1.5'
                    : ''
            }`
        });

        return iconElement;
    };

    return (
        <button
            type={type}
            className={combinedClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </span>
            ) : (
                <>
                    {iconPosition === 'left' && renderIcon()}
                    {children}
                    {iconPosition === 'right' && renderIcon()}
                </>
            )}
        </button>
    );
};

export default Button;
// end of frontend/components/buttons/Button.tsx