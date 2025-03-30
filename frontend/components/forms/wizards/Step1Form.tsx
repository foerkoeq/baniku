// start of frontend/components/forms/wizards/Step1Form.tsx
import React from 'react';
import InputField from '../InputField';
import DatePicker from '../DatePicker';
import Select from '../Select';

export const Step1Form = ({ formik }: any) => {
    const genderOptions = [
        { value: 'MALE', label: 'Laki-laki' },
        { value: 'FEMALE', label: 'Perempuan' },
        { value: 'OTHER', label: 'Lainnya' }
    ];

    const statusOptions = [
        { value: 'ALIVE', label: 'Hidup' },
        { value: 'DECEASED', label: 'Wafat' }
    ];

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <InputField
                    label="Gelar Depan"
                    placeholder="cth: Dr."
                    {...formik.getFieldProps('titlePrefix')}
                    error={formik.touched.titlePrefix && formik.errors.titlePrefix}
                />

                <div className="md:col-span-2">
                    <InputField
                        label="Nama Lengkap"
                        placeholder="Masukkan nama lengkap"
                        required
                        {...formik.getFieldProps('fullName')}
                        error={formik.touched.fullName && formik.errors.fullName}
                    />
                </div>

                <InputField
                    label="Gelar Belakang"
                    placeholder="cth: S.Pd"
                    {...formik.getFieldProps('titleSuffix')}
                    error={formik.touched.titleSuffix && formik.errors.titleSuffix}
                />
            </div>

            <Select
                label="Jenis Kelamin"
                options={genderOptions}
                value={formik.values.gender}
                onChange={(value) => formik.setFieldValue('gender', value)}
                error={formik.touched.gender && formik.errors.gender}
                required
            />

            <div className="grid gap-4 md:grid-cols-2">
                <DatePicker
                    label="Tanggal Lahir"
                    value={formik.values.birthDate}
                    onChange={(date) => formik.setFieldValue('birthDate', date)}
                    error={formik.touched.birthDate && formik.errors.birthDate}
                />

                <InputField
                    label="Tempat Lahir"
                    placeholder="Masukkan tempat lahir"
                    {...formik.getFieldProps('birthPlace')}
                    error={formik.touched.birthPlace && formik.errors.birthPlace}
                />
            </div>

            <Select
                label="Status"
                options={statusOptions}
                value={formik.values.status}
                onChange={(value) => formik.setFieldValue('status', value)}
                error={formik.touched.status && formik.errors.status}
                required
            />

            {formik.values.status === 'DECEASED' && (
                <div className="grid gap-4 md:grid-cols-2">
                    <DatePicker
                        label="Tanggal Wafat"
                        value={formik.values.deathDate}
                        onChange={(date) => formik.setFieldValue('deathDate', date)}
                        error={formik.touched.deathDate && formik.errors.deathDate}
                        required
                    />

                    <InputField
                        label="Tempat Wafat"
                        placeholder="Masukkan tempat wafat"
                        {...formik.getFieldProps('deathPlace')}
                        error={formik.touched.deathPlace && formik.errors.deathPlace}
                        required
                    />
                </div>
            )}
        </div>
    );
};