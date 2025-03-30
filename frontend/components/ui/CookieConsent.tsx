// start of frontend/components/ui/CookieConsent.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { showToast } from './toast';

const CookieConsent = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Cek apakah user sudah pernah menyetujui cookies
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setShow(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShow(false);
        showToast('success', 'Preferensi cookie Anda telah disimpan');
    };

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'false');
        setShow(false);
        showToast('info', 'Anda dapat mengubah preferensi cookie di pengaturan');
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm p-4 shadow-lg z-50">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm">
                    <p>
                        Kami menggunakan cookie untuk meningkatkan pengalaman Anda. Cookie diperlukan untuk fitur "Ingat Saya" 
                        dan preferensi situs.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={handleReject}
                        className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                        Tolak
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90"
                    >
                        Terima
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
// end of frontend/components/ui/CookieConsent.tsx