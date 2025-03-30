// start of app/layout.tsx
import ProviderComponent from '@/components/layouts/provider-component';
import { MantineProvider } from '@mantine/core';
import { Toast } from '@/components/ui/toast';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import CookieConsent from '@/components/ui/CookieConsent';
import '@/styles/book.css';

export const metadata: Metadata = {
    title: {
        template: '%s | Bani Web',
        default: 'Bani Web - Aplikasi Silsilah Keluarga',
    },
};

const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={nunito.variable}>
                <MantineProvider>
                    <ProviderComponent>
                        {children}
                        <Toast />
                        <CookieConsent />
                        </ProviderComponent>
                </MantineProvider>
            </body>
        </html>
    );
}
// end of app/layout.tsx