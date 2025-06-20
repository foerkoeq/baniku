// start of frontend/components/layouts/footer.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import PrivacyPolicyModal from '@/components/modals/PrivacyPolicyModal';

const Footer = () => {
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

    return (
        <>
            <footer className="p-6 pt-0 mt-auto dark:text-white-dark">
                <div className="border-t border-[#ebe9e9] dark:border-[#1b2e4b] py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="text-center sm:text-left">
                            © {new Date().getFullYear()} Bani Web. All rights reserved.
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <Link href="/help" className="hover:text-primary hover:underline">
                                Bantuan
                            </Link>
                            <button 
                                onClick={() => setShowPrivacyPolicy(true)}
                                className="hover:text-primary hover:underline"
                            >
                                Kebijakan Privasi
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

            <PrivacyPolicyModal 
                open={showPrivacyPolicy} 
                onClose={() => setShowPrivacyPolicy(false)} 
            />
        </>
    );
};

export default Footer;
// end of frontend/components/layouts/footer.tsx