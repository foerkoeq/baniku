// start of frontend/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get path dan token
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value || request.headers.get('Authorization');
    
    // Cek cookie justLoggedIn
    const justLoggedIn = request.cookies.get('justLoggedIn')?.value === 'true';

    // Path yang tidak perlu authentication
    const publicPaths = ['/auth/login', '/auth/forgot-password', '/auth/reset-password'];
    const isPublicPath = publicPaths.some(p => path.startsWith(p));

    // Debug info lengkap
    console.log('------------- MIDDLEWARE DEBUG -------------');
    console.log('Middleware running, path:', path);
    console.log('Token exists:', !!token);
    console.log('justLoggedIn cookie:', request.cookies.get('justLoggedIn')?.value);

    // Alternatif cara melihat semua cookies yang tersedia tanpa entries() atau getAll()
    const cookieHeader = request.headers.get('cookie') || '';
    console.log('Raw cookies header:', cookieHeader);
    
    console.log('isPublicPath:', isPublicPath);
    console.log('-------------------------------------------');

    // Jika user baru login, redirect ke dashboard
    if (justLoggedIn) {
        console.log('User just logged in, redirecting to root');
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('justLoggedIn');
        return response;
    }

    // Jika path bukan public dan tidak ada token, redirect ke login
    if (!isPublicPath && !token) {
        const redirectUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Jika sudah ada token dan mencoba akses halaman auth, redirect ke dashboard
    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Konfigurasi path mana saja yang perlu di-handle middleware
export const config = {
    matcher: [
        /*
         * Match semua path kecuali:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - assets
         */
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)'
    ],
};
// end of frontend/middleware.ts