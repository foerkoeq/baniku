// start of frontend/components/forms/ChildrenForm.tsx
'use client';
import React from 'react';
import { Field, FieldArray } from 'formik';
import InputField from './InputField';
import NumberInput from './NumberInput';
import IconPlus from '@/components/icon/icon-plus';
import IconX from '@/components/icon/icon-x';

interface Child {
    titlePrefix: string;
    fullName: string;
    titleSuffix: string;
}

interface ChildrenFormProps {
    values: {
        hasChildren: boolean;
        numberOfChildren: number;
        children: Child[];
    };
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
}

const ChildrenForm: React.FC<ChildrenFormProps> = ({
    values,
    errors,
    touched,
    setFieldValue
}) => {
    // Handle number of children change
    const handleNumberOfChildrenChange = (value: number) => {
        setFieldValue('numberOfChildren', value);
        
        // Sync children array length with numberOfChildren
        const currentLength = values.children.length;
        if (value > currentLength) {
            // Add new children
            const newChildren = Array(value - currentLength).fill({
                titlePrefix: '',
                fullName: '',
                titleSuffix: ''
            });
            setFieldValue('children', [...values.children, ...newChildren]);
        } else if (value < currentLength) {
            // Remove excess children
            setFieldValue('children', values.children.slice(0, value));
        }
    };

    return (
        <div className="space-y-4">
            {/* Has Children Toggle */}
            <div className="flex items-center space-x-2">
                <Field
                    type="checkbox"
                    name="hasChildren"
                    id="hasChildren"
                    className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 
                        focus:ring-primary dark:border-gray-600"
                />
                <label htmlFor="hasChildren" className="text-sm font-medium">
                    Memiliki Anak
                </label>
            </div>

            {/* Number of Children Input */}
            {values.hasChildren && (
                <div className="mt-4">
                    <NumberInput
                        label="Jumlah Anak"
                        value={values.numberOfChildren}
                        onChange={handleNumberOfChildrenChange}
                        min={0}
                        max={50}
                        error={errors.numberOfChildren}
                        required
                    />
                </div>
            )}

            {/* Children Form Fields */}
            {values.hasChildren && values.numberOfChildren > 0 && (
                <FieldArray name="children">
                    {({ remove, push }) => (
                        <div className="space-y-4">
                            {values.children.map((child, index) => (
                                <div 
                                    key={index}
                                    className="relative rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                                >
                                    {/* Child Number Label */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <h4 className="text-lg font-medium">
                                            Anak ke-{index + 1}
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                remove(index);
                                                handleNumberOfChildrenChange(values.numberOfChildren - 1);
                                            }}
                                            className="text-gray-400 hover:text-danger"
                                        >
                                            <IconX className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Child Form Fields */}
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {/* Title Prefix */}
                                        <InputField
                                            label="Gelar Depan"
                                            placeholder="cth: Dr."
                                            {...Field({
                                                name: `children.${index}.titlePrefix`,
                                                className: "w-full"
                                            })}
                                            error={
                                                touched.children?.[index]?.titlePrefix &&
                                                errors.children?.[index]?.titlePrefix
                                            }
                                        />

                                        {/* Full Name */}
                                        <div className="md:col-span-2">
                                            <InputField
                                                label="Nama Lengkap"
                                                placeholder="Masukkan nama lengkap"
                                                required
                                                {...Field({
                                                    name: `children.${index}.fullName`,
                                                    className: "w-full"
                                                })}
                                                error={
                                                    touched.children?.[index]?.fullName &&
                                                    errors.children?.[index]?.fullName
                                                }
                                            />
                                        </div>

                                        {/* Title Suffix */}
                                        <InputField
                                            label="Gelar Belakang"
                                            placeholder="cth: S.Pd"
                                            {...Field({
                                                name: `children.${index}.titleSuffix`,
                                                className: "w-full"
                                            })}
                                            error={
                                                touched.children?.[index]?.titleSuffix &&
                                                errors.children?.[index]?.titleSuffix
                                            }
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Add Child Button */}
                            {values.children.length < 50 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        push({
                                            titlePrefix: '',
                                            fullName: '',
                                            titleSuffix: ''
                                        });
                                        handleNumberOfChildrenChange(values.numberOfChildren + 1);
                                    }}
                                    className="mt-4 flex w-full items-center justify-center space-x-2 rounded-lg 
                                        border-2 border-dashed border-gray-300 p-4 text-gray-600 hover:border-primary 
                                        hover:text-primary dark:border-gray-600 dark:text-gray-400"
                                >
                                    <IconPlus className="h-5 w-5" />
                                    <span>Tambah Anak</span>
                                </button>
                            )}
                        </div>
                    )}
                </FieldArray>
            )}
        </div>
    );
};

export default ChildrenForm;
// end of frontend/components/forms/ChildrenForm.tsx