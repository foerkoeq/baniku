'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/button';

interface User {
    id: string;
    fullName: string;
    username: string;
    email: string;
    role: string;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit' | 'resetPassword' | 'changeRole';
    user?: User;
    onSubmit: (data: any) => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, mode, user, onSubmit }) => {
    const [formData, setFormData] = useState<any>({
        fullName: '',
        username: '',
        email: '',
        role: 'Kontributor',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if ((mode === 'edit' || mode === 'changeRole') && user) {
            setFormData({
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                password: '',
                confirmPassword: '',
            });
        } else if (mode === 'resetPassword' && user) {
            setFormData({
                ...formData,
                password: '',
                confirmPassword: '',
            });
        } else {
            // Mode 'add'
            setFormData({
                fullName: '',
                username: '',
                email: '',
                role: 'Kontributor',
                password: '',
                confirmPassword: '',
            });
        }
    }, [mode, user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Clear error on change
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (mode === 'add' || mode === 'edit') {
            if (!formData.fullName) newErrors.fullName = 'Nama lengkap wajib diisi';
            if (!formData.username) newErrors.username = 'Username wajib diisi';
            if (!formData.email) newErrors.email = 'Email wajib diisi';
            else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
        }
        
        if (mode === 'changeRole') {
            if (!formData.role) newErrors.role = 'Peran wajib diisi';
        }

        if (mode === 'add') {
            if (!formData.password) newErrors.password = 'Kata sandi wajib diisi';
            else if (formData.password.length < 8) newErrors.password = 'Kata sandi minimal 8 karakter';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Konfirmasi kata sandi wajib diisi';
            else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Konfirmasi kata sandi tidak sama';
        } else if (mode === 'resetPassword') {
            if (!formData.password) newErrors.password = 'Kata sandi baru wajib diisi';
            else if (formData.password.length < 8) newErrors.password = 'Kata sandi minimal 8 karakter';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Konfirmasi kata sandi wajib diisi';
            else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Konfirmasi kata sandi tidak sama';
        }

        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    const getTitle = () => {
        if (mode === 'add') return 'Tambah User Baru';
        if (mode === 'edit') return 'Edit User';
        if (mode === 'changeRole') return 'Ubah Peran User';
        return 'Atur Ulang Kata Sandi';
    };

    return (
        <Modal
            isOpen={isOpen}
            title={getTitle()}
            onClose={onClose}
            size="lg"
        >
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    {(mode === 'add' || mode === 'edit') && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="fullName" className="mb-2 block text-sm font-medium">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    className={`form-input ${errors.fullName ? 'border-danger' : ''}`}
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                                {errors.fullName && (
                                    <span className="mt-1 text-sm text-danger">{errors.fullName}</span>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="username" className="mb-2 block text-sm font-medium">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Masukkan username"
                                    className={`form-input ${errors.username ? 'border-danger' : ''}`}
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                                {errors.username && (
                                    <span className="mt-1 text-sm text-danger">{errors.username}</span>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Masukkan email"
                                    className={`form-input ${errors.email ? 'border-danger' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && (
                                    <span className="mt-1 text-sm text-danger">{errors.email}</span>
                                )}
                            </div>
                        </>
                    )}

                    {(mode === 'add' || mode === 'changeRole') && (
                        <div className="mb-4">
                            <label htmlFor="role" className="mb-2 block text-sm font-medium">
                                Peran
                            </label>
                            <select
                                id="role"
                                name="role"
                                className={`form-select ${errors.role ? 'border-danger' : ''}`}
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="Kontributor">Kontributor</option>
                                <option value="Editor">Editor</option>
                                <option value="Admin Bani">Admin Bani</option>
                                <option value="Super Admin">Super Admin</option>
                            </select>
                            {errors.role && (
                                <span className="mt-1 text-sm text-danger">{errors.role}</span>
                            )}
                        </div>
                    )}

                    {(mode === 'add' || mode === 'resetPassword') && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                                    {mode === 'resetPassword' ? 'Kata Sandi Baru' : 'Kata Sandi'}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={mode === 'resetPassword' ? 'Masukkan kata sandi baru' : 'Masukkan kata sandi'}
                                    className={`form-input ${errors.password ? 'border-danger' : ''}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && (
                                    <span className="mt-1 text-sm text-danger">{errors.password}</span>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                                    Konfirmasi Kata Sandi
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Konfirmasi kata sandi"
                                    className={`form-input ${errors.confirmPassword ? 'border-danger' : ''}`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                {errors.confirmPassword && (
                                    <span className="mt-1 text-sm text-danger">{errors.confirmPassword}</span>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8 flex items-center justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        color="secondary"
                        onClick={onClose}
                        className="mr-2"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                    >
                        {mode === 'add' ? 'Tambah' : 
                         mode === 'edit' ? 'Simpan' : 
                         mode === 'changeRole' ? 'Simpan Perubahan' : 'Atur Ulang'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UserModal; 