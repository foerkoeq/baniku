import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - Bani Web',
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return <div className="min-h-screen text-black dark:text-white-dark">{children} </div>;
};

export default AuthLayout;
