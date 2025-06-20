// start of frontend/utils/validation.ts
import * as Yup from 'yup';

// Step 1: Informasi Dasar
export const personalInfoSchema = Yup.object().shape({
    titlePrefix: Yup.string(),
    fullName: Yup.string()
        .required('Nama lengkap wajib diisi')
        .min(3, 'Nama terlalu pendek')
        .max(100, 'Nama terlalu panjang'),
    titleSuffix: Yup.string(),
    gender: Yup.string()
        .required('Jenis kelamin wajib dipilih')
        .oneOf(['MALE', 'FEMALE', 'OTHER']),
    birthDate: Yup.date()
        .max(new Date(), 'Tanggal lahir tidak boleh lebih dari hari ini')
        .nullable(),
    birthPlace: Yup.string(),
    status: Yup.string()
        .required('Status wajib dipilih')
        .oneOf(['ALIVE', 'DECEASED']),
    deathDate: Yup.date()
        .nullable()
        .when('status', {
            is: 'DECEASED',
            then: (schema) => schema.required('Tanggal wafat wajib diisi untuk status wafat'),
        }),
    deathPlace: Yup.string()
        .when('status', {
            is: 'DECEASED',
            then: (schema) => schema.required('Tempat wafat wajib diisi untuk status wafat'),
        }),
});

// Step 2: Informasi Tambahan
export const additionalInfoSchema = Yup.object().shape({
    address: Yup.object().shape({
        street: Yup.string(),
        provinceId: Yup.string().required('Provinsi wajib dipilih'),
        cityId: Yup.string().required('Kota/Kabupaten wajib dipilih'),
        districtId: Yup.string().required('Kecamatan wajib dipilih'),
        postalCode: Yup.string()
    }),
    phone: Yup.string()
        .matches(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka')
        .min(10, 'Nomor telepon terlalu pendek')
        .max(15, 'Nomor telepon terlalu panjang'),
    maritalStatus: Yup.string()
        .required('Status pernikahan wajib dipilih')
        .oneOf(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'REMARRIED']),
    photo: Yup.mixed()
        .test('fileSize', 'Ukuran file terlalu besar (max 5MB)', (value) => {
            if (!value) return true;
            return value && 'size' in (value as File) && (value as File).size <= 5 * 1024 * 1024;
        })
        .test('fileType', 'Format file tidak didukung', (value) => {
            if (!value) return true;
            return ['image/jpeg', 'image/png', 'image/gif'].includes((value as File).type);
        }),
});

// Step 3: Informasi Hubungan
export const relationshipInfoSchema = Yup.object().shape({
    // Spouse info (jika status menikah)
    spouse: Yup.object().when('maritalStatus', {
        is: (val: string) => ['MARRIED', 'REMARRIED'].includes(val),
        then: (schema) => schema.shape({
            fullName: Yup.string().required('Nama pasangan wajib diisi'),
            birthDate: Yup.date().nullable(),
            deathDate: Yup.date().nullable(),
        }),
    }),

    // Previous marriage info
    previousMarriages: Yup.array().when('maritalStatus', {
        is: (val: string) => ['DIVORCED', 'WIDOWED', 'REMARRIED'].includes(val),
        then: (schema) => schema.of(
            Yup.object().shape({
                spouseName: Yup.string().required('Nama pasangan wajib diisi'),
                marriageDate: Yup.date().nullable(),
                divorceDate: Yup.date().nullable(),
                isDivorced: Yup.boolean(),
                isSpouseDeceased: Yup.boolean(),
            })
        ),
    }),

    // Children info
    hasChildren: Yup.boolean(),
    numberOfChildren: Yup.number()
        .when('hasChildren', {
            is: true,
            then: (schema) => schema
                .required('Jumlah anak wajib diisi')
                .min(1, 'Jumlah anak minimal 1')
                .max(50, 'Jumlah anak terlalu banyak'),
        }),
    children: Yup.array().when('hasChildren', {
        is: true,
        then: (schema) => schema.of(
            Yup.object().shape({
                titlePrefix: Yup.string(),
                fullName: Yup.string().required('Nama anak wajib diisi'),
                titleSuffix: Yup.string(),
            })
        ).min(1, 'Minimal satu anak harus diisi'),
    }),
});

// Initial values for form
export const initialValues = {
    // Step 1
    titlePrefix: '',
    fullName: '',
    titleSuffix: '',
    gender: '',
    birthDate: null,
    birthPlace: '',
    status: 'ALIVE',
    deathDate: null,
    deathPlace: '',

    // Step 2
    address: {
        street: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        postalCode: ''
    },
    phone: '',
    maritalStatus: 'SINGLE',
    photo: [],

    // Step 3
    spouse: null,
    previousMarriages: [],
    hasChildren: false,
    numberOfChildren: 0,
    children: []
};

export const getStepSchema = (step: number) => {
    switch (step) {
        case 1:
            return personalInfoSchema;
        case 2:
            return additionalInfoSchema;
        case 3:
            return relationshipInfoSchema;
        default:
            return personalInfoSchema;
    }
};
// end of frontend/utils/validation.ts