// start of frontend/components/auth/components-auth-forgot-password-form.tsx
'use client';
import IconMail from '@/components/icon/icon-mail';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { showToast } from '@/components/ui/toast';

const ComponentsAuthForgotPasswordForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                email: email
            });

            if (response.data.status === 'success') {
                // Simpan email di session storage untuk digunakan di halaman verifikasi
                sessionStorage.setItem('resetEmail', email);
                
                showToast('success', 'Kode OTP telah dikirim ke email Anda');
                console.log('Forgot password berhasil:', response.data.message);
                
                // Beri jeda sebentar agar user bisa melihat toast success
                setTimeout(() => {
                    router.push('/auth/verify-code');
                }, 1000);
            }
        } catch (err: any) {
            console.error('Forgot password error:', err);
            
            // Handle specific error status
            if (err.response?.status === 500) {
                router.push('/pages/error500');
                return;
            }
            
            if (err.response?.status === 503) {
                router.push('/pages/error503');
                return;
            }

            // Handle other errors with toast
            if (err.response?.status === 404) {
                showToast('error', 'Email tidak ditemukan');
            } else if (err.response?.status === 429) {
                showToast('error', 'Terlalu banyak percobaan. Silakan tunggu beberapa saat.');
            } else {
                showToast('error', 'Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-5" onSubmit={submitForm}>
            <div>
                <label htmlFor="email" className="dark:text-white">
                    Email
                </label>
                <div className="relative text-white-dark">
                    <input
                        id="email"
                        type="email"
                        placeholder="Masukkan email"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Link href="/auth/login" className="text-primary hover:underline">
                    Kembali ke halaman masuk
                </Link>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
                {loading ? 'Memproses...' : 'Kirim Kode OTP'}
            </button>
        </form>
    );
};

export default ComponentsAuthForgotPasswordForm;
// end of frontend/components/auth/components-auth-forgot-password-form.tsx