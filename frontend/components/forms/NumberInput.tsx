// start of frontend/components/forms/NumberInput.tsx
'use client';
import React from 'react';
import IconMinus from '@/components/icon/icon-minus';
import IconPlus from '@/components/icon/icon-plus';

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    required?: boolean;
    error?: string;
    readOnly?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    required = false,
    error,
    readOnly = false,
    disabled = false,
    size = 'md',
    className = '',
}) => {
    const handleDecrease = () => {
        if (disabled || readOnly) return;
        const newValue = value - step;
        if (newValue >= min) {
            onChange(newValue);
        }
    };

    const handleIncrease = () => {
        if (disabled || readOnly) return;
        const newValue = value + step;
        if (newValue <= max) {
            onChange(newValue);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled || readOnly) return;
        const newValue = parseInt(e.target.value);
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    // Get component size classes
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-8 w-20 text-sm';
            case 'lg':
                return 'h-12 w-28 text-lg';
            default:
                return 'h-10 w-24';
        }
    };

    // Get button size classes
    const getButtonSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-8 h-8';
            case 'lg':
                return 'w-12 h-12';
            default:
                return 'w-10 h-10';
        }
    };

    return (
        <div className={`form-field ${className}`}>
            {label && (
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {required && <span className="text-danger">*</span>}
                </label>
            )}

            <div className={`flex items-center ${disabled ? 'opacity-60' : ''}`}>
                <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={disabled || value <= min}
                    className={`${getButtonSizeClasses()} flex items-center justify-center border border-r-0 
                        ${disabled || value <= min 
                            ? 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800' 
                            : 'border-primary bg-primary text-white hover:bg-primary-dark'
                        } rounded-l-md`}
                >
                    <IconMinus className="w-4 h-4" />
                </button>

                <input
                    type="number"
                    value={value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step}
                    readOnly={readOnly}
                    disabled={disabled}
                    className={`${getSizeClasses()} form-input rounded-none text-center 
                        ${error ? 'border-danger' : 'border-gray-300 dark:border-gray-700'}
                        ${disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800' : ''}`}
                />

                <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={disabled || value >= max}
                    className={`${getButtonSizeClasses()} flex items-center justify-center border border-l-0 
                        ${disabled || value >= max
                            ? 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800'
                            : 'border-primary bg-primary text-white hover:bg-primary-dark'
                        } rounded-r-md`}
                >
                    <IconPlus className="w-4 h-4" />
                </button>
            </div>

            {error && (
                <p className="mt-1 text-sm text-danger">
                    {error}
                </p>
            )}
        </div>
    );
};

export default NumberInput;
// end of frontend/components/forms/NumberInput.tsx