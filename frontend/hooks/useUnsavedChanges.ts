// start of frontend/hooks/useUnsavedChanges.ts
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const useUnsavedChanges = (isDirty: boolean) => {
    const router = useRouter();
    const pathname = usePathname();
    const [showPrompt, setShowPrompt] = useState(false);
    const [nextUrl, setNextUrl] = useState<string | null>(null);

    useEffect(() => {
        // Handle browser back/forward buttons and page refresh
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        // Handle browser navigation
        const handlePopState = (e: PopStateEvent) => {
            if (isDirty) {
                e.preventDefault();
                setShowPrompt(true);
                setNextUrl(window.location.pathname);
                // Restore current URL to maintain state
                window.history.pushState(null, '', pathname);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isDirty, pathname]);

    // Function to handle route changes programmatically
    const handleRouteChange = (url: string) => {
        if (isDirty) {
            setNextUrl(url);
            setShowPrompt(true);
            return false;
        }
        router.push(url);
        return true;
    };

    return {
        showPrompt,
        setShowPrompt,
        nextUrl,
        setNextUrl,
        handleRouteChange
    };
};
// end of frontend/hooks/useUnsavedChanges.ts