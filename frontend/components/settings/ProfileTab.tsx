// start of frontend/components/settings/ProfileTab.tsx
import React from 'react';
import PersonWizard from '../forms/PersonWizard';

export default function ProfileTab() {
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
            
            // Handle success - bisa tambahkan notifikasi sukses
        } catch (err: any) {
            // Handle error - bisa tambahkan notifikasi error
        }
    };

    return (
        <div>
            <h2 className="mb-6 text-lg font-semibold">Edit Profil</h2>
            <PersonWizard onSubmit={handleSubmit} />
        </div>
    );
}
// end of frontend/components/settings/ProfileTab.tsx