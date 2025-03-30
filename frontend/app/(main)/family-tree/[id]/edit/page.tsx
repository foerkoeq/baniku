// start of frontend/app/(main)/family-tree/[id]/edit/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonWizard from '@/components/forms/PersonWizard';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import { showToast, showLoadingToast, updateLoadingToast } from '@/components/ui/toast';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import UnsavedChangesModal from '@/components/modals/UnsavedChangesModal';

interface EditPersonPageProps {
    params: {
        id: string;
    };
}

const EditPersonPage = ({ params }: EditPersonPageProps) => {
    const router = useRouter();
    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formDirty, setFormDirty] = useState(false);
    
    // Menggunakan hook useUnsavedChanges
    const { showPrompt, setShowPrompt, nextUrl, setNextUrl, handleRouteChange } = useUnsavedChanges(formDirty);

    // Fetch initial data
    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const response = await fetch(`/api/persons/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch person data');
                }

                const data = await response.json();
                setInitialData(data.data.person);
            } catch (error) {
                console.error('Error fetching person:', error);
                setError('Gagal memuat data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPerson();
    }, [params.id]);

    // Handle form submission
    const handleSubmit = async (values: any) => {
        const toastId = showLoadingToast('Menyimpan data...');
        try {
            const formData = new FormData();
            
            // Add modified fields
            Object.keys(values).forEach(key => {
                if (key !== 'photo') {
                    formData.append(key, values[key]);
                }
            });

            // Add new photo if exists
            if (values.photo && values.photo[0]?.file) {
                formData.append('photo', values.photo[0].file);
            }

            // Submit to API
            const response = await fetch(`/api/persons/${params.id}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update person');
            }

            // Show success message
            updateLoadingToast(toastId, 'success', 'Data berhasil disimpan');
            
            // Reset form dirty state
            setFormDirty(false);

            // Return to detail view
            router.push(`/family-tree/${params.id}`);

        } catch (error) {
            console.error('Failed to update person:', error);
            updateLoadingToast(toastId, 'error', 'Gagal menyimpan data');
        }
    };

    // Handle back button click
    const handleBack = () => {
        if (formDirty) {
            setNextUrl(`/family-tree/${params.id}`);
            setShowPrompt(true);
        } else {
            router.back();
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center">
                <p className="mb-4 text-lg text-danger">{error}</p>
                <button
                    onClick={handleBack}
                    className="mb-4 flex items-center text-sm text-gray-500 hover:text-primary"
                >
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="p-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="mb-4 flex items-center text-sm text-gray-500 hover:text-primary"
                    >
                        <IconArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </button>

                    <h1 className="text-2xl font-bold">Edit Data Anggota Keluarga</h1>
                    <p className="text-gray-500">
                        Silakan ubah data yang diperlukan
                    </p>
                </div>

                {/* Wizard Form */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <PersonWizard 
                        onSubmit={handleSubmit}
                        initialData={initialData}
                        onChange={(values, initialValues) => {
                            // Check if form is dirty by comparing values with initial values
                            const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);
                            setFormDirty(isDirty);
                        }}
                    />
                </div>
            </div>

            {/* Unsaved Changes Modal */}
            <UnsavedChangesModal
                show={showPrompt}
                onClose={() => {
                    setShowPrompt(false);
                    setNextUrl(null);
                }}
                onConfirm={() => {
                    setFormDirty(false);
                    setShowPrompt(false);
                    if (nextUrl) {
                        router.push(nextUrl);
                    } else {
                        router.back();
                    }
                }}
            />
        </>
    );
};

export default EditPersonPage;
// end of frontend/app/(main)/family-tree/[id]/edit/page.tsx