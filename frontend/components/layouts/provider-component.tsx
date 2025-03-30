// start of frontend/components/layouts/provider-component.tsx
'use client';
import React, { ReactNode, Suspense, createContext, useContext, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import App from '@/App';
import Loading from '@/components/layouts/loading';
import { setUser, clearUser } from '@/store/userSlice';
import { useDispatch } from 'react-redux';
import axios from '@/lib/axios';

// Tipe data untuk user
interface User {
    id: string;
    username: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN_BANI' | 'ADMIN_KELUARGA' | 'MEMBER';
    person?: {
        id: string;
        fullName: string;
        baniId: string;
    };
}

// Context untuk Auth
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    login: (username: string, password: string, remember?: boolean) => Promise<User | void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook untuk menggunakan auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Provider untuk Auth yang terintegrasi dengan Redux
const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    // Fungsi untuk menyinkronkan state user antara Context dan Redux
    const setUserData = (userData: User | null) => {
        setUserState(userData);
        if (userData) {
            dispatch(setUser(userData));
            console.log('User data set in AuthContext and Redux:', userData);
        } else {
            dispatch(clearUser());
            console.log('User data cleared in AuthContext and Redux');
        }
    };

    useEffect(() => {
        // Cek token dan load user data saat aplikasi dimuat
        const checkAuth = async () => {
            try {
                // Skip auth check on login page to prevent loops
                if (typeof window !== 'undefined' && window.location.pathname.includes('/auth/login')) {
                    setIsLoading(false);
                    return;
                }

                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
                
                // If no token or user data, clear everything
                if (!token || !userStr) {
                    clearStorageAndState();
                    return;
                }

                try {
                    // First set user from storage to prevent flicker
                    const storedUser = JSON.parse(userStr);
                    setUserData(storedUser);

                    // Then verify with server
                    const response = await axios.get('/api/auth/me');
                    if (response.data.status === 'success') {
                        const userData = response.data.data.user;
                        setUserData(userData);
                        
                        // Update storage with fresh data
                        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
                        storage.setItem('user', JSON.stringify(userData));
                    } else {
                        clearStorageAndState();
                    }
                } catch (error: any) { // Type the error as any to access axios error properties
                    if (error?.response?.status === 429) {
                        // On rate limit, keep using stored data
                        console.log('Rate limit hit, using stored user data');
                    } else {
                        clearStorageAndState();
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
                clearStorageAndState();
            } finally {
                setIsLoading(false);
            }
        };

        const clearStorageAndState = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            
            // Hapus cookie token juga
            document.cookie = 'token=; max-age=0; path=/';
            
            setUserData(null);
        };

        checkAuth();
    }, [dispatch]);

    const login = async (username: string, password: string, remember = false) => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            
            if (response.data.status === 'success') {
                const { token, user: userData } = response.data.data;
                
                console.log('Login berhasil, user data:', userData);
                
                // Simpan token dan user data sesuai opsi remember
                if (remember) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Data disimpan di localStorage');
                } else {
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    console.log('Data disimpan di sessionStorage');
                }
                
                // Tambah token sebagai cookie juga untuk middleware
                const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 hari atau 1 hari
                document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
                console.log('Token juga disimpan sebagai cookie untuk middleware');
                
                // Set user di Context dan Redux
                setUserData(userData);
                
                return userData;
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            
            // Hapus cookie token juga
            document.cookie = 'token=; max-age=0; path=/';
            
            setUserData(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser: setUserData, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Provider untuk Notifikasi
interface NotificationContextType {
    notifications: any[];
    addNotification: (notification: any) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook untuk menggunakan notification context
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// Provider untuk Notifikasi
const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<any[]>([]);

    const addNotification = (notification: any) => {
        setNotifications(prev => [notification, ...prev]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

// Komponen Role Debugger untuk development
const RoleDebugger = () => {
    const { user } = useAuth();

    // Jika mode production atau tidak ada user, jangan tampilkan debugger
    if (process.env.NODE_ENV === 'production' || !user) {
        return null;
    }

    return (
        <div 
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                fontSize: '12px',
                zIndex: 9999,
                maxWidth: '250px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Role Debug:
            </div>
            <div>User: {user.username}</div>
            <div>Role: <span style={{ color: 'blue', fontWeight: 'bold' }}>{user.role}</span></div>
            {user.person && (
                <div>Person: {user.person.fullName}</div>
            )}
        </div>
    );
};

// Main Provider Component
interface IProps {
    children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
    return (
        <Provider store={store}>
            <AuthProvider>
                <NotificationProvider>
                    <Suspense fallback={<Loading />}>
                        <App>{children}</App>
                        {process.env.NODE_ENV !== 'production' && <RoleDebugger />}
                    </Suspense>
                </NotificationProvider>
            </AuthProvider>
        </Provider>
    );
};

export default ProviderComponent;
// end of frontend/components/layouts/provider-component.tsx