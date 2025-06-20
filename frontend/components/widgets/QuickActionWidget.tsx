// start of frontend/components/widgets/QuickActionsWidget.tsx
'use client';
import React from 'react';
import BaseWidget from './BaseWidget';
import Link from 'next/link';
import { 
  UserPlus, 
  Users, 
  Calendar, 
  ImageIcon,
  FileEdit,
  Camera,
  BookOpen 
} from 'lucide-react';
import { useRole } from '@/hooks/useRole'; // akan kita buat untuk cek role user

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  roles: ('SUPER_ADMIN' | 'ADMIN' | 'MEMBER')[];
  color: string;
}

const actions: QuickAction[] = [
  {
    id: 'add-person',
    title: 'Tambah Anggota',
    description: 'Tambah anggota keluarga baru',
    icon: <UserPlus className="h-6 w-6" />,
    href: '/family-tree/add-person',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    color: 'bg-primary/10 text-primary dark:bg-primary dark:text-primary-light'
  },
  {
    id: 'view-tree',
    title: 'Pohon Keluarga',
    description: 'Lihat pohon silsilah keluarga',
    icon: <Users className="h-6 w-6" />,
    href: '/family-tree',
    roles: ['SUPER_ADMIN', 'ADMIN', 'MEMBER'],
    color: 'bg-success/10 text-success dark:bg-success dark:text-success-light'
  },
  {
    id: 'add-event',
    title: 'Buat Event',
    description: 'Buat event keluarga baru',
    icon: <Calendar className="h-6 w-6" />,
    href: '/events/create',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    color: 'bg-warning/10 text-warning dark:bg-warning dark:text-warning-light'
  },
  {
    id: 'add-story',
    title: 'Tulis Cerita',
    description: 'Tambah cerita bani',
    icon: <FileEdit className="h-6 w-6" />,
    href: '/bani-story/create',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    color: 'bg-info/10 text-info dark:bg-info dark:text-info-light'
  },
  {
    id: 'upload-photos',
    title: 'Upload Foto',
    description: 'Upload foto keluarga',
    icon: <Camera className="h-6 w-6" />,
    href: '/gallery/upload',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    color: 'bg-secondary/10 text-secondary dark:bg-secondary dark:text-secondary-light'
  },
  {
    id: 'view-stories',
    title: 'Baca Cerita',
    description: 'Baca cerita keluarga',
    icon: <BookOpen className="h-6 w-6" />,
    href: '/bani-story',
    roles: ['SUPER_ADMIN', 'ADMIN', 'MEMBER'],
    color: 'bg-danger/10 text-danger dark:bg-danger dark:text-danger-light'
  }
];

const ActionCard = ({ action }: { action: QuickAction }) => (
  <Link 
    href={action.href}
    className="block p-4 border dark:border-gray-700 rounded-lg hover:border-primary 
    dark:hover:border-primary transition-colors group"
  >
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg ${action.color}`}>
        {action.icon}
      </div>
      <div>
        <h6 className="font-semibold text-sm group-hover:text-primary transition-colors">
          {action.title}
        </h6>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {action.description}
        </p>
      </div>
    </div>
  </Link>
);

const QuickActionsWidget = () => {
  const { role } = useRole();

  const filteredActions = actions.filter(action => 
    action.roles.includes(role)
  );

  return (
    <BaseWidget 
      title="Aksi Cepat"
      isCollapsible={false}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredActions.map(action => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
    </BaseWidget>
  );
};

export default QuickActionsWidget;
// end of frontend/components/widgets/QuickActionsWidget.tsx