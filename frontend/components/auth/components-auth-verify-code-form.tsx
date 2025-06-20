// start of frontend/components/auth/components-auth-verify-code-form.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { showToast } from '@/components/ui/toast';

const ComponentsAuthVerifyCodeForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    // Cek email di sessionStorage
    useEffect(() => {
        const email = sessionStorage.getItem('resetEmail');
        if (!email) {
            showToast('error', 'Sesi telah berakhir. Silakan mulai dari awal.');
            setTimeout(() => {
                router.push('/auth/forgot-password');
            }, 1000);
        }
    }, [router]);

    // Effect untuk countdown
    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    // Handle input change dengan auto-focus
    const handleChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Auto focus ke input berikutnya jika ada input
            if (value !== '' && index < 5) {
                inputRefs[index + 1].current?.focus();
            }
        }
    };

    // Handle backspace untuk navigasi mundur
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (code[index] === '' && index > 0) {
                // Jika kosong, fokus ke input sebelumnya
                inputRefs[index - 1].current?.focus();
            } else {
                // Jika ada isi, hapus isi dulu
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };

    // Handle paste kode OTP
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newCode = [...code];
            pastedData.split('').forEach((char, index) => {
                if (index < 6) newCode[index] = char;
            });
            setCode(newCode);
            
            // Focus ke input terakhir
            if (pastedData.length === 6) {
                inputRefs[5].current?.focus();
            } else {
                inputRefs[pastedData.length].current?.focus();
            }
        } else {
            showToast('error', 'Kode OTP hanya boleh berisi angka');
        }
    };

    // Submit kode OTP
    const submitCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join('');
        const email = sessionStorage.getItem('resetEmail');

        if (verificationCode.length !== 6) {
            showToast('error', 'Masukkan 6 digit kode OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-code`, {
                email,
                code: verificationCode
            });

            if (response.data.status === 'success') {
                sessionStorage.setItem('resetToken', response.data.token);
                showToast('success', 'Kode OTP valid');
                
                setTimeout(() => {
                    router.push('/auth/reset-password');
                }, 1000);
            }
        } catch (err: any) {
            console.error('Verify code error:', err);
            
            if (err.response?.status === 500) {
                router.push('/pages/error500');
                return;
            }
            
            if (err.response?.status === 503) {
                router.push('/pages/error503');
                return;
            }

            if (err.response?.status === 401) {
                showToast('error', 'Kode OTP tidak valid');
            } else if (err.response?.status === 410) {
                showToast('error', 'Kode OTP telah kadaluarsa');
            } else {
                showToast('error', 'Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Kirim ulang kode OTP
    const handleResend = async () => {
        if (!canResend) return;
        
        setLoading(true);
        try {
            const email = sessionStorage.getItem('resetEmail');
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                email
            });
            
            showToast('success', 'Kode OTP baru telah dikirim');
            setCountdown(30);
            setCanResend(false);
            setCode(['', '', '', '', '', '']); // Reset input fields
            inputRefs[0].current?.focus(); // Focus ke input pertama
        } catch (err: any) {
            if (err.response?.status === 429) {
                showToast('error', 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.');
            } else {
                showToast('error', 'Gagal mengirim ulang kode OTP');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitCode} className="space-y-5">
            <div>
                <div className="mb-4 grid grid-cols-6 gap-3">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="form-input h-14 text-center text-lg"
                            required
                            disabled={loading}
                            autoFocus={index === 0}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-5 text-center text-white-dark">
                {!canResend ? (
                    <p>Kirim ulang kode dalam {countdown} detik</p>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-primary hover:underline"
                        disabled={loading}
                    >
                        Kirim Ulang Kode OTP
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-primary hover:underline">
                    Ubah Email
                </Link>
            </div>

            <button
                type="submit"
                disabled={loading || code.some(digit => digit === '')}
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
                {loading ? 'Memproses...' : 'Verifikasi'}
            </button>
        </form>
    );
};

export default ComponentsAuthVerifyCodeForm;
// end of frontend/components/auth/components-auth-verify-code-form.tsx