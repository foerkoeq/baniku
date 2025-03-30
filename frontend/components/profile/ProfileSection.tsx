// start of frontend/components/profile/ProfileSection.tsx
'use client';
import React from 'react';
import InfoItem from './InfoItem';

interface ProfileSectionProps {
    title: string;
    data: any;
    type?: 'personal' | 'contact' | 'spouse' | 'children';
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, data, type = 'personal' }) => {
    // Tambahkan pengecekan data
    if (!data) {
        return (
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                <h2 className="mb-4 text-lg font-semibold">{title}</h2>
                <p className="text-gray-500 dark:text-gray-400">Data tidak tersedia</p>
            </div>
        );
    }

    const renderContent = () => {
        switch (type) {
            case 'contact':
                return (
                    <div className="space-y-4">
                        <InfoItem label="Alamat" value={data?.address?.street} />
                        <InfoItem label="Telepon" value={data?.phone} />
                    </div>
                );
            case 'spouse':
                return (
                    <div className="space-y-4">
                        <InfoItem label="Nama Pasangan" value={data?.spouse?.fullName} />
                        <InfoItem 
                            label="Tanggal Lahir" 
                            value={data?.spouse?.birthDate && new Date(data.spouse.birthDate).toLocaleDateString('id-ID')} 
                        />
                    </div>
                );
            case 'children':
                return (
                    <div className="space-y-4">
                        {data?.children?.map((child: any, index: number) => (
                            <InfoItem 
                                key={child.id || index} 
                                label={`Anak ke-${index + 1}`} 
                                value={child.fullName} 
                            />
                        ))}
                    </div>
                );
            default:
                // Format nama lengkap dengan safety checks
                const fullName = [
                    data.titlePrefix,
                    data.fullName,
                    data.titleSuffix
                ].filter(Boolean).join(' ');

                return (
                    <div className="space-y-4">
                        <InfoItem label="Nama Lengkap" value={fullName} />
                        <InfoItem 
                            label="Jenis Kelamin" 
                            value={data.gender ? (data.gender === 'MALE' ? 'Laki-laki' : 'Perempuan') : '-'} 
                        />
                        <InfoItem 
                            label="Tanggal Lahir" 
                            value={data.birthDate ? new Date(data.birthDate).toLocaleDateString('id-ID') : '-'} 
                        />
                        <InfoItem label="Tempat Lahir" value={data.birthPlace || '-'} />
                        <InfoItem 
                            label="Status" 
                            value={data.status ? (data.status === 'ALIVE' ? 'Hidup' : 'Wafat') : '-'} 
                        />
                    </div>
                );
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold">{title}</h2>
            {renderContent()}
        </div>
    );
};

export default ProfileSection;
// end of frontend/components/profile/ProfileSection.tsx