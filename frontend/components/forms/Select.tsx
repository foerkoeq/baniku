// start of frontend/components/forms/Select.tsx
'use client';
import React from 'react';
import ReactSelect, { Props as SelectProps, GroupBase } from 'react-select';

interface Option {
    label: string;
    value: string | number;
    isDisabled?: boolean;
}

interface Group extends GroupBase<Option> {
    label: string;
    options: Option[];
}

interface CustomSelectProps extends Omit<SelectProps<Option, boolean, Group>, 'options'> {
    label?: string;
    error?: string;
    required?: boolean;
    options: Option[] | Group[];
    isMulti?: boolean;
    isSearchable?: boolean;
    isDisabled?: boolean;
    placeholder?: string;
    className?: string;
    onChange?: (value: any) => void;
    value?: any;
}

const Select: React.FC<CustomSelectProps> = ({
    label,
    error,
    required = false,
    options,
    isMulti = false,
    isSearchable = false,
    isDisabled = false,
    placeholder = 'Pilih...',
    className = '',
    onChange,
    value,
    ...props
}) => {
    const customStyles = {
        control: (base: any, state: any) => ({
            ...base,
            borderColor: error ? 'rgb(239 68 68)' : state.isFocused ? 'rgb(var(--primary))' : '#e0e6ed',
            boxShadow: state.isFocused ? `0 0 0 1px ${error ? 'rgb(239 68 68)' : 'rgb(var(--primary))'}` : 'none',
            '&:hover': {
                borderColor: error ? 'rgb(239 68 68)' : 'rgb(var(--primary))'
            }
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? 'rgb(var(--primary))' : state.isFocused ? 'rgba(var(--primary), 0.1)' : 'transparent',
            color: state.isSelected ? 'white' : 'inherit',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: 'rgba(var(--primary), 0.2)'
            }
        }),
        multiValue: (base: any) => ({
            ...base,
            backgroundColor: 'rgba(var(--primary), 0.1)',
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            color: 'rgb(var(--primary))',
        }),
        multiValueRemove: (base: any) => ({
            ...base,
            color: 'rgb(var(--primary))',
            '&:hover': {
                backgroundColor: 'rgb(var(--primary))',
                color: 'white',
            },
        }),
        menu: (base: any) => ({
            ...base,
            zIndex: 50
        })
    };

    return (
        <div className={`form-field ${className}`}>
            {label && (
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {required && <span className="text-danger">*</span>}
                </label>
            )}

            <ReactSelect
                options={options}
                isMulti={isMulti}
                isSearchable={isSearchable}
                isDisabled={isDisabled}
                placeholder={placeholder}
                styles={customStyles}
                className="react-select"
                classNamePrefix="select"
                onChange={onChange}
                value={value}
                {...props}
            />

            {error && (
                <p className="mt-1 text-sm text-danger">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
// end of frontend/components/forms/Select.tsx