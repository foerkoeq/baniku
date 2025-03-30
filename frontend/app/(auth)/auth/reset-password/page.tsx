// start of frontend/app/(auth)/auth/reset-password/page.tsx
import ComponentsAuthResetPasswordForm from '@/components/auth/components-auth-reset-password-form';
import Image from 'next/image';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Reset Kata Sandi - Bani Web',
};

const ResetPassword = () => {
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                {/* Logo */}
                                <div className="mb-8 flex justify-center">
                                    <Image
                                        src="/assets/images/logo.svg"
                                        alt="Bani Web Logo"
                                        width={120}
                                        height={120}
                                        className="dark:invert"
                                    />
                                </div>
                                
                                {/* Header Text */}
                                <div className="text-center">
                                    <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Reset Kata Sandi</h1>
                                    <p className="text-base text-white-dark">
                                        Silakan buat kata sandi baru untuk akun Anda.
                                    </p>
                                </div>
                            </div>
                            <ComponentsAuthResetPasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
// end of frontend/app/(auth)/auth/reset-password/page.tsx