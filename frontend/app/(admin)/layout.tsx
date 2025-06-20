'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Header from '@/components/layouts/header';
import Footer from '@/components/layouts/footer';
import Sidebar from '@/components/layouts/sidebar';
import ContentAnimation from '@/components/layouts/content-animation';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Setting from '@/components/layouts/setting';
import Portals from '@/components/portals';
import Toast from '@/components/ui/toast';

/**
 * Layout khusus untuk area admin yang hanya bisa diakses oleh SUPER_ADMIN
 * Layout ini mirip dengan layout utama tetapi memiliki proteksi akses
 */
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user } = useSelector((state: any) => state.user);

    useEffect(() => {
        // Cek apakah user memiliki role Super Admin
        if (!user || user.role !== 'SUPER_ADMIN') {
            // Redirect ke halaman utama jika bukan Super Admin
            router.push('/');
        }
    }, [user, router]);

    if (!user || user.role !== 'SUPER_ADMIN') {
        return null; // Tidak tampilkan apa-apa sampai redirect selesai
    }

    return (
        <>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">
                <Toast />
                <Overlay />
                <ScrollToTop />

                {/* BEGIN APP SETTING LAUNCHER */}
                <Setting />
                {/* END APP SETTING LAUNCHER */}

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    <Sidebar />
                    {/* END SIDEBAR */}
                    <div className="main-content flex min-h-screen flex-col">
                        {/* BEGIN TOP NAVBAR */}
                        <Header />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <ContentAnimation>
                            <div className="p-4">
                                <div className="mb-5">
                                    <ul className="flex space-x-2 rtl:space-x-reverse">
                                        <li>
                                            <a href="/" className="text-primary hover:underline">
                                                Beranda
                                            </a>
                                        </li>
                                        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                                            <span>Admin</span>
                                        </li>
                                    </ul>
                                </div>
                                {children}
                            </div>
                        </ContentAnimation>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        <Footer />
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </MainContainer>
            </div>
        </>
    );
} 