// start of frontend/app/(main)/profile/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import PersonWizard from '@/components/forms/PersonWizard';
import ProfileSection from '@/components/profile/ProfileSection';
import { IRootState } from '@/store';
import { useSelector } from 'react-redux';
import IconPencil from '@/components/icon/icon-pencil';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const user = useSelector((state: IRootState) => state.user);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/persons/me');
            if (!response.ok) throw new Error('Gagal mengambil data profil');
            const data = await response.json();
            setProfileData(data.data.person);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const response = await fetch('/api/persons/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error('Gagal memperbarui profil');

            await fetchProfileData();
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Profil Saya</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Kelola informasi profil Anda
                    </p>
                </div>

                {!isEditing && (
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        icon={<IconPencil className="h-4 w-4" />}
                    >
                        Edit Profil
                    </Button>
                )}
            </div>

            {error && (
                <Alert 
                    type="outline"
                    color='danger'
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            {isEditing ? (
                <PersonWizard
                    initialData={profileData}
                    onSubmit={handleSubmit}
                />
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    <ProfileSection 
                        title="Informasi Pribadi"
                        data={profileData}
                    />
                    
                    <ProfileSection 
                        title="Informasi Kontak"
                        data={profileData}
                        type="contact"
                    />

                    {profileData?.spouse && (
                        <ProfileSection 
                            title="Informasi Pasangan"
                            data={profileData}
                            type="spouse"
                        />
                    )}

                    {profileData?.children?.length > 0 && (
                        <ProfileSection 
                            title="Informasi Anak"
                            data={profileData}
                            type="children"
                        />
                    )}
                </div>
            )}
        </div>
    );
}
// end of frontend/app/(main)/profile/page.tsx