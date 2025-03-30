// start of frontend/components/forms/InputField.tsx
'use client';
import React, { useState } from 'react';
import IconEye from '@/components/icon/icon-eye';
import IconEyeOff from '@/components/icon/icon-eye-off';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id?: string;
    label?: string;
    error?: string;
    icon?: React.ReactElement;
    iconPosition?: 'left' | 'right';
    prefix?: string;
    suffix?: string;
    containerClassName?: string;
    helperText?: string;
    required?: boolean;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    (
        {
            id,
            label,
            error,
            icon,
            iconPosition = 'left',
            prefix,
            suffix,
            containerClassName = '',
            helperText,
            required = false,
            className = '',
            type = 'text',
            disabled = false,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className={`form-field ${containerClassName}`}>
                {/* Label */}
                {label && (
                    <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
                        {label}
                        {required && <span className="text-danger">*</span>}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Prefix */}
                    {prefix && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 dark:text-gray-400">{prefix}</span>
                        </div>
                    )}

                    {/* Icon Left */}
                    {icon && iconPosition === 'left' && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            {React.cloneElement(icon, {
                                className: 'w-5 h-5 text-gray-400'
                            })}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        ref={ref}
                        id={id}
                        type={inputType}
                        disabled={disabled}
                        className={`form-input w-full rounded-lg border bg-white 
                            ${error ? 'border-danger' : 'border-[#e0e6ed] hover:border-primary focus:border-primary dark:border-[#17263c]'} 
                            ${disabled ? 'cursor-not-allowed bg-[#eee] dark:bg-[#1b2e4b]' : ''}
                            ${prefix ? 'pl-8' : ''}
                            ${suffix || type === 'password' ? 'pr-10' : ''}
                            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
                            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
                            ${className}`}
                        {...props}
                    />

                    {/* Icon Right */}
                    {icon && iconPosition === 'right' && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {React.cloneElement(icon, {
                                className: 'w-5 h-5 text-gray-400'
                            })}
                        </div>
                    )}

                    {/* Suffix or Password Toggle */}
                    {(suffix || type === 'password') && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {type === 'password' ? (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <IconEyeOff className="h-5 w-5" />
                                    ) : (
                                        <IconEye className="h-5 w-5" />
                                    )}
                                </button>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">{suffix}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Helper Text */}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {helperText}
                    </p>
                )}

                {/* Error Message */}
                {error && (
                    <p className="mt-1 text-sm text-danger">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;
// end of frontend/components/forms/InputField.tsx