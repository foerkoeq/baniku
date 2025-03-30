// start of frontend/app/(main)/family-tree/add-person/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PersonWizard from '@/components/forms/PersonWizard';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import Alert from '@/components/ui/alert';
import { showLoadingToast, showToast, updateLoadingToast } from '@/components/ui/toast';

const AddPersonPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isRootPerson, setIsRootPerson] = useState(false);
    
    // Get context from URL params
    const parentId = searchParams.get('parentId');
    const spouseOf = searchParams.get('spouseOf');
    const baniId = searchParams.get('baniId');

    // Cek apakah ini adalah penambahan data awal (root)
    useEffect(() => {
        // Jika tidak ada parentId dan spouseOf, maka ini adalah penambahan data awal
        if (!parentId && !spouseOf) {
            setIsRootPerson(true);
        }
    }, [parentId, spouseOf]);

    // Handle form submission
    const handleSubmit = async (values: any) => {
        // Show loading toast
        const toastId = showLoadingToast('Menyimpan data...');
        try {
            // Prepare form data with context
            const formData = new FormData();
            
            // Add basic fields
            Object.keys(values).forEach(key => {
                if (key !== 'photo') {
                    formData.append(key, values[key]);
                }
            });

            // Add context
            if (parentId) formData.append('parentId', parentId);
            if (spouseOf) formData.append('spouseOf', spouseOf);
            if (baniId) formData.append('baniId', baniId);
            
            // Jika ini adalah data awal, tandai sebagai root
            if (isRootPerson) {
                formData.append('isRoot', 'true');
            }

            // Add photo if exists
            if (values.photo) {
                formData.append('photo', values.photo[0]);
            }

            // Submit to API
            const response = await fetch('/api/persons', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to add person');
            }

            // Show success message
            updateLoadingToast(toastId, 'success', 'Data berhasil disimpan');

            // Return to family tree
            router.push('/family-tree');

        } catch (error) {
            console.error('Failed to add person:', error);
            updateLoadingToast(toastId, 'error', 'Gagal menyimpan data'); 
        }
    };

    // Get title based on context
    const getTitle = () => {
        if (isRootPerson) return 'Tambah Data Awal Silsilah';
        if (spouseOf) return 'Tambah Data Pasangan';
        if (parentId) return 'Tambah Data Anak';
        return 'Tambah Anggota Keluarga';
    };

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center text-sm text-gray-500 hover:text-primary"
                >
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </button>

                <h1 className="text-2xl font-bold">{getTitle()}</h1>
                <p className="text-gray-500">
                    Silakan isi data berikut dengan lengkap dan benar
                </p>
            </div>

            {/* Informasi tambahan untuk data awal */}
            {isRootPerson && (
                <Alert 
                    type="info"
                    className="mb-6"
                >
                    <div className="space-y-2">
                        <h4 className="font-semibold">Informasi Penting</h4>
                        <p>
                            Anda akan membuat data awal silsilah keluarga. Ini akan menjadi data utama
                            yang menjadi dasar struktur silsilah Bani.
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Data awal adalah cikal bakal dari silsilah Bani</li>
                            <li>Setelah dibuat, Anda dapat menambahkan anggota keluarga lainnya</li>
                            <li>Pastikan data yang dimasukkan sudah benar</li>
                        </ul>
                    </div>
                </Alert>
            )}

            {/* Wizard Form */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <PersonWizard 
                    onSubmit={handleSubmit} 
                    initialData={isRootPerson ? { gender: 'MALE' } : undefined}
                />
            </div>
        </div>
    );
};

export default AddPersonPage;
// end of frontend/app/(main)/family-tree/add-person/page.tsx