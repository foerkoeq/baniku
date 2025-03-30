'use client';
import { useEffect } from 'react';
import ComponentsAuthLoginForm from 'components/auth/components-auth-login-form';
import React from 'react';
import Image from 'next/image';

const LoginPage = () => {
    useEffect(() => {
        // Only clear if not already on login page to prevent loops
        if (!window.location.pathname.includes('/auth/login')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            
            // Hapus semua cookie terkait auth
            document.cookie = 'justLoggedIn=; max-age=0; path=/';
            document.cookie = 'token=; max-age=0; path=/';
            
            console.log('Token dibersihkan saat navigasi ke login');
        }
    }, []);

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10 text-center">
                                <Image 
                                    src="/assets/images/logo1.png" 
                                    alt="Logo" 
                                    width={3554}
                                    height={1321}
                                    className="mx-auto mb-4 w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] h-auto"
                                    priority
                                />
                                <h1 className="text-3xl font-extrabold !leading-snug text-primary md:text-4xl">Selamat Datang</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Silakan masuk untuk melanjutkan</p>
                            </div>
                            <ComponentsAuthLoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
