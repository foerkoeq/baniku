'use client';
import { useState } from 'react';
import { DataTable } from 'mantine-datatable';
import Button from '@/components/ui/button';
import { IconEdit, IconTrash, IconKey, IconUserShield } from '@tabler/icons-react';
import UserModal from '@/components/modals/UserModal';
import SweetAlert from '@/components/ui/Sweetalert';

interface User {
    id: string;
    fullName: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

const dummyUsers: User[] = [
    {
        id: '1',
        fullName: 'Administrator Sistem',
        username: 'admin',
        email: 'admin@bani.web.id',
        role: 'Super Admin',
        createdAt: '2023-01-01'
    },
    {
        id: '2',
        fullName: 'Pengelola Konten',
        username: 'editor',
        email: 'editor@bani.web.id',
        role: 'Editor',
        createdAt: '2023-01-15'
    },
    {
        id: '3',
        fullName: 'Ahmad Fadli',
        username: 'fadli',
        email: 'fadli@bani.web.id',
        role: 'Admin Bani',
        createdAt: '2023-02-10'
    },
    {
        id: '4',
        fullName: 'Sarah Azizah',
        username: 'sarah',
        email: 'sarah@bani.web.id',
        role: 'Admin Bani',
        createdAt: '2023-03-05'
    },
    {
        id: '5',
        fullName: 'Irfan Hakim',
        username: 'irfan',
        email: 'irfan@bani.web.id',
        role: 'Kontributor',
        createdAt: '2023-04-20'
    },
];

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [users, setUsers] = useState<User[]>(dummyUsers);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    
    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
    
    // User ID untuk delete
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

    // Tambahkan state untuk pencarian
    const [searchTerm, setSearchTerm] = useState('');

    // Fungsi untuk menangani pencarian
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Filter pengguna berdasarkan pencarian
    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsEditModalOpen(true);
        }
    };

    const handleChangeRole = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsChangeRoleModalOpen(true);
        }
    };

    const handleDelete = (userId: string) => {
        setUserIdToDelete(userId);
        
        // Implementasi yang benar dari SweetAlert dengan metode fire
        SweetAlert.fire({
            title: 'Apakah Anda yakin?',
            text: 'Anda tidak dapat mengembalikan data yang sudah dihapus!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-outline-danger ltr:mr-3 rtl:ml-3'
            },
            type: 'warning'
        }).then((result: any) => {
            if (result && result.isConfirmed) {
                confirmDelete();
            } else {
                setUserIdToDelete(null);
            }
        });
    };

    const confirmDelete = () => {
        if (userIdToDelete) {
            // Di sini kita hanya melakukan manipulasi pada data dummy
            // Pada implementasi sebenarnya, kita akan memanggil API untuk menghapus user
            setUsers(users.filter(user => user.id !== userIdToDelete));
            setUserIdToDelete(null);
        }
    };

    const handleResetPassword = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsResetPasswordModalOpen(true);
        }
    };

    const handleUpdateUser = (data: any) => {
        // Di sini kita hanya melakukan manipulasi pada data dummy
        // Pada implementasi sebenarnya, kita akan memanggil API untuk update user
        if (selectedUser) {
            const updatedUsers = users.map(user => {
                if (user.id === selectedUser.id) {
                    return {
                        ...user,
                        fullName: data.fullName,
                        username: data.username,
                        email: data.email
                    };
                }
                return user;
            });
            
            setUsers(updatedUsers);
            setIsEditModalOpen(false);
        }
    };

    const handleRoleUpdate = (data: any) => {
        // Logika untuk mengubah role user
        if (selectedUser) {
            const updatedUsers = users.map(user => {
                if (user.id === selectedUser.id) {
                    return {
                        ...user,
                        role: data.role
                    };
                }
                return user;
            });
            
            setUsers(updatedUsers);
            setIsChangeRoleModalOpen(false);
        }
    };

    const handleResetPasswordSubmit = (data: any) => {
        // Di sini kita hanya simulasi reset password
        // Pada implementasi sebenarnya, kita akan memanggil API untuk reset password
        console.log('Reset password for user:', selectedUser?.fullName);
        console.log('New password:', data.password);
        setIsResetPasswordModalOpen(false);
    };

    const columns = [
        {
            accessor: 'id',
            title: 'ID',
            sortable: true,
        },
        {
            accessor: 'fullName',
            title: 'Nama Lengkap',
            sortable: true,
        },
        {
            accessor: 'username',
            title: 'Username',
            sortable: true,
        },
        {
            accessor: 'email',
            title: 'Email',
            sortable: true,
        },
        {
            accessor: 'role',
            title: 'Peran',
            sortable: true,
            render: (record: User) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${record.role === 'Super Admin' 
                        ? 'bg-danger-light text-danger dark:bg-danger/20' 
                        : record.role === 'Admin Bani'
                        ? 'bg-primary-light text-primary dark:bg-primary/20'
                        : record.role === 'Editor'
                        ? 'bg-success-light text-success dark:bg-success/20'
                        : 'bg-info-light text-info dark:bg-info/20'
                    }`}
                >
                    {record.role}
                </span>
            ),
        },
        {
            accessor: 'actions',
            title: 'Aksi',
            render: (record: User) => (
                <div className="flex space-x-1">
                    <Button
                        variant="outline"
                        color="info"
                        size="sm"
                        onClick={() => handleEdit(record.id)}
                        icon={<IconEdit size={16} />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        color="primary"
                        size="sm"
                        onClick={() => handleChangeRole(record.id)}
                        icon={<IconUserShield size={16} />}
                    >
                        Ubah Role
                    </Button>
                    <Button
                        variant="outline"
                        color="warning"
                        size="sm"
                        onClick={() => handleResetPassword(record.id)}
                        icon={<IconKey size={16} />}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="outline"
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        icon={<IconTrash size={16} />}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="panel">
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Manajemen User</h5>
                
            </div>
            <div>
                <p className="mb-5 text-gray-500 dark:text-gray-400">
                    Kelola semua pengguna dalam sistem. Anda dapat mengubah peran, mengatur ulang kata sandi, atau menghapus pengguna sesuai kebutuhan.
                </p>
            </div>
            
            <div className="datatables">
                <DataTable
                    columns={columns.map(column => ({
                        ...column,
                        onClick: () => {
                            const sortedUsers = [...filteredUsers].sort((a, b) => {
                                const aValue = a[column.accessor as keyof User];
                                const bValue = b[column.accessor as keyof User];
                                if (aValue < bValue) return -1;
                                if (aValue > bValue) return 1;
                                return 0;
                            });
                            setUsers(sortedUsers);
                        }
                    }))}
                    records={filteredUsers}
                    page={page}
                    onPageChange={setPage}
                    totalRecords={users.length}
                    recordsPerPage={pageSize}
                    onRecordsPerPageChange={setPageSize}
                    recordsPerPageOptions={[10, 20, 30, 50]}
                    striped
                    highlightOnHover
                    className="whitespace-nowrap table-hover"
                    minHeight={400}
                    paginationText={({ from, to, totalRecords }: { from: number; to: number; totalRecords: number }) => 
                        `Menampilkan ${from} sampai ${to} dari ${totalRecords} data`
                    }
                />
            </div>

            {/* Modal Edit User */}
            <UserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                user={selectedUser}
                onSubmit={handleUpdateUser}
            />

            {/* Modal Ubah Role */}
            <UserModal
                isOpen={isChangeRoleModalOpen}
                onClose={() => setIsChangeRoleModalOpen(false)}
                mode="changeRole"
                user={selectedUser}
                onSubmit={handleRoleUpdate}
            />

            {/* Modal Reset Password */}
            <UserModal
                isOpen={isResetPasswordModalOpen}
                onClose={() => setIsResetPasswordModalOpen(false)}
                mode="resetPassword"
                user={selectedUser}
                onSubmit={handleResetPasswordSubmit}
            />
        </div>
    );
} 