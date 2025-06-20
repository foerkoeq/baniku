// start of frontend/components/auth/components-auth-login-form.tsx
'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconUser from '@/components/icon/icon-user';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { showToast } from '@/components/ui/toast';
import { useAuth } from '@/components/layouts/provider-component';

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        remember: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Gunakan fungsi login dari AuthContext
            await login(formData.username, formData.password, formData.remember);
            
            showToast('success', 'Login berhasil! Anda akan dialihkan...');
            
            // Debug log untuk membantu troubleshooting
            console.log('Login berhasil, redirecting ke dashboard');
            
            // Set temporary cookie dengan path yang benar dan SameSite policy
            console.log('Setting justLoggedIn cookie');
            document.cookie = 'justLoggedIn=true; max-age=60; path=/; SameSite=Lax';
            console.log('Cookie set, checking:', document.cookie);

            // Berikan sedikit waktu untuk cookie di-set dan middleware menangkap perubahan
            setTimeout(() => {
                console.log('Redirect ke dashboard akan dieksekusi');
                console.log('Cookie saat redirect:', document.cookie);
                window.location.href = '/';
            }, 500);
            
        } catch (err: any) {
            console.error('Login error:', err);

            // Error handling
            const errorMap: { [key: number]: string } = {
                401: 'Username atau password salah',
                403: 'Akun Anda dinonaktifkan. Silakan hubungi admin.',
                500: 'Terjadi kesalahan pada server',
                503: 'Layanan sedang tidak tersedia'
            };

            const status = err.response?.status;
            if (status === 500 || status === 503) {
                router.push(`/pages/error${status}`);
                return;
            }

            showToast('error', errorMap[status] || 'Terjadi kesalahan saat login. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            <div>
                <label htmlFor="username">Nama Pengguna</label>
                <div className="relative text-white-dark">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Masukkan nama pengguna"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>

            <div>
                <label htmlFor="password">Kata Sandi</label>
                <div className="relative text-white-dark">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Masukkan kata sandi"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        name="remember"
                        className="form-checkbox bg-white dark:bg-black"
                        checked={formData.remember}
                        onChange={handleChange}
                    />
                    <span className="text-white-dark">Ingat Saya</span>
                </label>

                <Link 
                    href="/auth/forgot-password"
                    className="text-primary hover:underline"
                >
                    Lupa Kata Sandi?
                </Link>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
                {loading ? 'Memproses...' : 'Masuk'}
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
// end of frontend/components/auth/components-auth-login-form.tsx