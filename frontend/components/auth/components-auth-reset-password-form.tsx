// start of frontend/components/auth/components-auth-reset-password-form.tsx
'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComponentsAuthResetPasswordForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Cek apakah user memiliki token reset
    useEffect(() => {
        const token = sessionStorage.getItem('resetToken');
        const email = sessionStorage.getItem('resetEmail');
        
        if (!token || !email) {
            router.push('/auth/forgot-password');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validatePassword = () => {
        if (formData.password.length < 8) {
            setError('Kata sandi minimal 8 karakter');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Konfirmasi kata sandi tidak cocok');
            return false;
        }
        return true;
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setLoading(true);
        setError('');

        try {
            const email = sessionStorage.getItem('resetEmail');
            const token = sessionStorage.getItem('resetToken');

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                email,
                token,
                newPassword: formData.password
            });

            if (response.data.status === 'success') {
                // Bersihkan session storage
                sessionStorage.removeItem('resetEmail');
                sessionStorage.removeItem('resetToken');

                // Tampilkan pesan sukses dan redirect
                alert('Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru Anda.');
                router.push('/auth/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat reset kata sandi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-5" onSubmit={submitForm}>
            {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-100">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="password" className="dark:text-white">
                    Kata Sandi Baru
                </label>
                <div className="relative text-white-dark">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan kata sandi baru"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                    <button
                        type="button"
                        className="absolute end-4 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={showPassword ? 'text-primary' : ''}
                        >
                            {showPassword ? (
                                <path d="M2 2L22 22M9.9337 9.9337C9.35645 10.511 9 11.2957 9 12.1432C9 13.8972 10.4624 15.3597 12.2165 15.3597C13.064 15.3597 13.8487 15.0032 14.426 14.426M7.38947 7.38947C5.10959 8.8523 3.16623 11.1138 2 13.8574C4.07926 18.687 8.02358 22 12.2165 22C14.5318 22 16.7038 21.1615 18.5 19.7856M11.2276 5.2005C11.5463 5.15331 11.8755 5.12717 12.2165 5.12717C16.4094 5.12717 20.3537 8.44013 22.433 13.2698C22.1989 13.774 21.9411 14.2613 21.6613 14.7303" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            ) : (
                                <path d="M12.2165 5.12717C16.4094 5.12717 20.3537 8.44013 22.433 13.2698C20.3537 18.0994 16.4094 21.4124 12.2165 21.4124C8.02358 21.4124 4.07926 18.0994 2 13.2698C4.07926 8.44013 8.02358 5.12717 12.2165 5.12717Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="dark:text-white">
                    Konfirmasi Kata Sandi
                </label>
                <div className="relative text-white-dark">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Konfirmasi kata sandi baru"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={8}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                    <button
                        type="button"
                        className="absolute end-4 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={showConfirmPassword ? 'text-primary' : ''}
                        >
                            {showConfirmPassword ? (
                                <path d="M2 2L22 22M9.9337 9.9337C9.35645 10.511 9 11.2957 9 12.1432C9 13.8972 10.4624 15.3597 12.2165 15.3597C13.064 15.3597 13.8487 15.0032 14.426 14.426M7.38947 7.38947C5.10959 8.8523 3.16623 11.1138 2 13.8574C4.07926 18.687 8.02358 22 12.2165 22C14.5318 22 16.7038 21.1615 18.5 19.7856M11.2276 5.2005C11.5463 5.15331 11.8755 5.12717 12.2165 5.12717C16.4094 5.12717 20.3537 8.44013 22.433 13.2698C22.1989 13.774 21.9411 14.2613 21.6613 14.7303" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            ) : (
                                <path d="M12.2165 5.12717C16.4094 5.12717 20.3537 8.44013 22.433 13.2698C20.3537 18.0994 16.4094 21.4124 12.2165 21.4124C8.02358 21.4124 4.07926 18.0994 2 13.2698C4.07926 8.44013 8.02358 5.12717 12.2165 5.12717Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
                {loading ? 'Memproses...' : 'Reset Kata Sandi'}
            </button>
        </form>
    );
};

export default ComponentsAuthResetPasswordForm;
// end of frontend/components/auth/components-auth-reset-password-form.tsx