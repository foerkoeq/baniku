// start of frontend/components/forms/DatePicker.tsx
'use client';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import 'flatpickr/dist/flatpickr.css';
import { BaseOptions } from "flatpickr/dist/types/options";

export type DatePickerType = 'date' | 'datetime' | 'time' | 'range';

interface DatePickerProps {
    value?: Date | Date[] | string;
    onChange?: (dates: Date[]) => void;
    type?: DatePickerType;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    className?: string;
    minDate?: Date;
    maxDate?: Date;
    showTimeInput?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    type = 'date',
    label,
    placeholder,
    disabled = false,
    required = false,
    error,
    className = '',
    minDate,
    maxDate,
    showTimeInput = false,
}) => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    // Konfigurasi dasar untuk semua tipe date picker
    const baseConfig: Partial<BaseOptions> = {
        position: isRtl ? 'auto right' : 'auto left',
        // Hapus enable, gunakan disabled langsung di elemen input
        minDate,
        maxDate,
    };

    // Konfigurasi spesifik untuk setiap tipe
    const getTypeConfig = (): Partial<BaseOptions> => {
        switch (type) {
            case 'datetime':
                return {
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i',
                };
            case 'time':
                return {
                    noCalendar: true,
                    enableTime: true,
                    dateFormat: 'H:i',
                };
            case 'range':
                return {
                    mode: 'range',
                    dateFormat: 'Y-m-d',
                };
            default:
                return {
                    dateFormat: 'Y-m-d',
                };
        }
    };

    // Combine semua options
    const options: Partial<BaseOptions> = {
        ...baseConfig,
        ...getTypeConfig(),
    };

    return (
        <div className="form-field">
            {label && (
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {required && <span className="text-danger">*</span>}
                </label>
            )}
            
            <div className="relative">
                <Flatpickr
                    value={value}
                    options={options}
                    className={`form-input w-full ${error ? 'border-danger' : ''} ${className}`}
                    onChange={(dates) => onChange?.(dates)}
                    placeholder={placeholder}
                    disabled={disabled} // Pindahkan disabled ke props Flatpickr
                />
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>

            {error && (
                <p className="mt-1 text-sm text-danger">
                    {error}
                </p>
            )}
        </div>
    );
};

export default DatePicker;
// end of frontend/components/forms/DatePicker.tsx