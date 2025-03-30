// start of frontend/components/forms/SpouseForm.tsx
'use client';
import React from 'react';
import { Field, FieldArray } from 'formik';
import InputField from './InputField';
import DatePicker from './DatePicker';
import Select from './Select';
import IconX from '../icon/icon-x';
import IconPlus from '../icon/icon-plus';


interface PreviousMarriage {
    spouseName: string;
    marriageDate?: Date | string;
    divorceDate?: Date | string;
    isDivorced: boolean;
    isSpouseDeceased: boolean;
}

interface SpouseFormProps {
    values: {
        maritalStatus: string;
        spouse?: {
            fullName: string;
            birthDate?: Date | string | null;
            deathDate?: Date | string | null;
        };
        previousMarriages: PreviousMarriage[];
    };
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
}

const SpouseForm: React.FC<SpouseFormProps> = ({
    values,
    errors,
    touched,
    setFieldValue
}) => {
    const marriageStatusOptions = [
        { value: 'SINGLE', label: 'Belum Menikah' },
        { value: 'MARRIED', label: 'Menikah' },
        { value: 'DIVORCED', label: 'Cerai Hidup' },
        { value: 'WIDOWED', label: 'Cerai Mati' },
        { value: 'REMARRIED', label: 'Menikah Lagi' }
    ];

    // Check if current status needs spouse info
    const needsSpouseInfo = ['MARRIED', 'REMARRIED'].includes(values.maritalStatus);
    
    // Check if needs previous marriage info
    const needsPreviousMarriageInfo = ['DIVORCED', 'WIDOWED', 'REMARRIED'].includes(values.maritalStatus);

    return (
        <div className="space-y-6">
            {/* Status Pernikahan */}
            <Select
                label="Status Pernikahan"
                options={marriageStatusOptions}
                value={values.maritalStatus}
                onChange={(value) => setFieldValue('maritalStatus', value)}
                error={errors.maritalStatus}
                required
            />

            {/* Current Spouse Info */}
            {needsSpouseInfo && (
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h4 className="mb-4 text-lg font-medium">
                        {values.maritalStatus === 'REMARRIED' ? 'Data Pasangan Saat Ini' : 'Data Pasangan'}
                    </h4>
                    <div className="grid gap-4">
                        <InputField
                            label="Nama Lengkap"
                            required
                            {...Field({
                                name: 'spouse.fullName',
                                className: "w-full"
                            })}
                            error={touched.spouse?.fullName && errors.spouse?.fullName}
                            placeholder="Masukkan nama lengkap pasangan"
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <DatePicker
                                label="Tanggal Lahir"
                                value={values.spouse?.birthDate || ''}
                                onChange={(date) => setFieldValue('spouse.birthDate', date)}
                                error={touched.spouse?.birthDate && errors.spouse?.birthDate}
                                maxDate={new Date()}
                            />

                            <DatePicker
                                label="Tanggal Wafat"
                                value={values.spouse?.deathDate || ''}
                                onChange={(date) => setFieldValue('spouse.deathDate', date)}
                                error={touched.spouse?.deathDate && errors.spouse?.deathDate}
                                maxDate={new Date()}
                                disabled={!values.spouse?.birthDate}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Previous Marriages */}
            {needsPreviousMarriageInfo && (
                <FieldArray name="previousMarriages">
                    {({ push, remove }) => (
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium">Riwayat Pernikahan Sebelumnya</h4>
                            
                            {values.previousMarriages.map((marriage, index) => (
                                <div 
                                    key={index}
                                    className="relative rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <h5 className="font-medium">
                                            Pernikahan Sebelumnya #{index + 1}
                                        </h5>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-gray-400 hover:text-danger"
                                        >
                                            <IconX className="h-5 w-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid gap-4">
                                        <InputField
                                            label="Nama Pasangan"
                                            required
                                            {...Field({
                                                name: `previousMarriages.${index}.spouseName`,
                                                className: "w-full"
                                            })}
                                            error={
                                                touched.previousMarriages?.[index]?.spouseName &&
                                                errors.previousMarriages?.[index]?.spouseName
                                            }
                                            placeholder="Masukkan nama pasangan"
                                        />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <DatePicker
                                                label="Tanggal Pernikahan"
                                                value={marriage.marriageDate}
                                                onChange={(date) => 
                                                    setFieldValue(`previousMarriages.${index}.marriageDate`, date)
                                                }
                                                error={
                                                    touched.previousMarriages?.[index]?.marriageDate &&
                                                    errors.previousMarriages?.[index]?.marriageDate
                                                }
                                                maxDate={new Date()}
                                            />

                                            {/* Conditional Fields */}
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-4">
                                                    <Field
                                                        type="checkbox"
                                                        name={`previousMarriages.${index}.isDivorced`}
                                                        className="form-checkbox h-5 w-5 text-primary"
                                                    />
                                                    <label className="text-sm">Bercerai</label>

                                                    <Field
                                                        type="checkbox"
                                                        name={`previousMarriages.${index}.isSpouseDeceased`}
                                                        className="form-checkbox h-5 w-5 text-primary"
                                                    />
                                                    <label className="text-sm">Pasangan Wafat</label>
                                                </div>

                                                {(marriage.isDivorced || marriage.isSpouseDeceased) && (
                                                    <DatePicker
                                                        label={marriage.isDivorced ? "Tanggal Perceraian" : "Tanggal Wafat"}
                                                        value={marriage.divorceDate}
                                                        onChange={(date) => 
                                                            setFieldValue(`previousMarriages.${index}.divorceDate`, date)
                                                        }
                                                        error={
                                                            touched.previousMarriages?.[index]?.divorceDate &&
                                                            errors.previousMarriages?.[index]?.divorceDate
                                                        }
                                                        maxDate={new Date()}
                                                        minDate={marriage.marriageDate ? new Date(marriage.marriageDate) : undefined}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => push({
                                    spouseName: '',
                                    marriageDate: null,
                                    divorceDate: null,
                                    isDivorced: false,
                                    isSpouseDeceased: false
                                })}
                                className="flex w-full items-center justify-center space-x-2 rounded-lg 
                                    border-2 border-dashed border-gray-300 p-4 text-gray-600 
                                    hover:border-primary hover:text-primary dark:border-gray-600 
                                    dark:text-gray-400"
                            >
                                <IconPlus className="h-5 w-5" />
                                <span>Tambah Riwayat Pernikahan</span>
                            </button>
                        </div>
                    )}
                </FieldArray>
            )}
        </div>
    );
};

export default SpouseForm;
// end of frontend/components/forms/SpouseForm.tsx