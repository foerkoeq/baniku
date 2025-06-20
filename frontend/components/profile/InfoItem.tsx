// start of frontend/components/profile/InfoItem.tsx
import React from 'react';

interface InfoItemProps {
    label: string;
    value?: string | null;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
    <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <p className="mt-1">{value || '-'}</p>
    </div>
);

export default InfoItem;
// end of frontend/components/profile/InfoItem.tsx