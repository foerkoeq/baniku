// start of frontend/components/forms/MaskedInput.tsx
'use client';
import React from 'react';
import TextMask from 'react-text-mask';

type MaskType = 'phone' | 'date' | 'number' | 'currency' | 'custom';

interface MaskedInputProps {
    type?: MaskType;
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    className?: string;
    customMask?: (RegExp | string)[];
    disabled?: boolean;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
    type = 'custom',
    value,
    onChange,
    label,
    placeholder,
    required = false,
    error,
    className = '',
    customMask,
    disabled = false,
}) => {
    // Predefined masks
    const masks: { [key in MaskType]?: (RegExp | string)[] } = {
        phone: ['(', /[0-9]/, /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
        date: [/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
        number: Array(10).fill(/[0-9]/),
        currency: ['Rp', ' ', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/],
    };

    // Get appropriate mask
    const getMask = () => {
        if (customMask) return customMask;
        return masks[type] || customMask || [];
    };

    // Get appropriate placeholder
    const getPlaceholder = () => {
        if (placeholder) return placeholder;
        switch (type) {
            case 'phone':
                return '(___) ___-____';
            case 'date':
                return '__/__/____';
            case 'currency':
                return 'Rp ___.___.___';
            default:
                return placeholder;
        }
    };

    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value);
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
                <TextMask
                    mask={getMask()}
                    guide={true}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder={getPlaceholder()}
                    className={`form-input w-full ${error ? 'border-danger' : ''} ${
                        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    } ${className}`}
                    render={(ref, props) => (
                        <input
                            ref={(node) => { if (node) ref(node); }}
                            type="text"
                            {...props}
                        />
                    )}
                />

                {/* Error message */}
                {error && (
                    <p className="mt-1 text-sm text-danger">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MaskedInput;
// end of frontend/components/forms/MaskedInput.tsx