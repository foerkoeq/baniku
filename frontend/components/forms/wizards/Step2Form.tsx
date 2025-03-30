// start of frontend/components/forms/wizards/Step2Form.tsx
import React from 'react';
import LocationSelect from '../LocationSelect';
import InputField from '../InputField';
import FileUpload from '../FileUpload';
import StoryEditor from '../StoryEditor';

export const Step2Form = ({ formik }: any) => {
    return (
        <div className="space-y-6">
            <LocationSelect
                value={{
                    provinceId: formik.values.address.provinceId,
                    cityId: formik.values.address.cityId,
                    districtId: formik.values.address.districtId
                }}
                onChange={(location) => {
                    formik.setFieldValue('address', {
                        ...formik.values.address,
                        ...location
                    });
                }}
                error={{
                    province: formik.touched.address?.provinceId && formik.errors.address?.provinceId,
                    city: formik.touched.address?.cityId && formik.errors.address?.cityId,
                    district: formik.touched.address?.districtId && formik.errors.address?.districtId
                }}
                required
            />

            <InputField
                label="Alamat Lengkap"
                placeholder="Masukkan alamat lengkap"
                {...formik.getFieldProps('address.street')}
                error={formik.touched.address?.street && formik.errors.address?.street}
            />

            <InputField
                label="Nomor Telepon"
                placeholder="Masukkan nomor telepon"
                type="tel"
                {...formik.getFieldProps('phone')}
                error={formik.touched.phone && formik.errors.phone}
            />

            <FileUpload
                label="Foto"
                value={formik.values.photo}
                onChange={(files) => formik.setFieldValue('photo', files)}
                error={formik.touched.photo && formik.errors.photo}
                accept="image/*"
                maxFileSize={5 * 1024 * 1024} // 5MB
            />

            <StoryEditor
                label="Cerita / Riwayat"
                value={formik.values.story}
                onChange={(value) => formik.setFieldValue('story', value)}
                error={formik.touched.story && formik.errors.story}
            />
        </div>
    );
};
