'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { IRootState } from '@/store';
import { toggleTheme, toggleSidebar } from '@/store/themeConfigSlice';
import Dropdown from '@/components/dropdown';
import IconMenu from '@/components/icon/icon-menu';
import IconSearch from '@/components/icon/icon-search';
import IconXCircle from '@/components/icon/icon-x-circle';
import IconSun from '@/components/icon/icon-sun';
import IconMoon from '@/components/icon/icon-moon';
import IconLaptop from '@/components/icon/icon-laptop';
import IconInfoCircle from '@/components/icon/icon-info-circle';
import IconBellBing from '@/components/icon/icon-bell-bing';
import IconUser from '@/components/icon/icon-user';
import IconLogout from '@/components/icon/icon-logout';
import { useRouter } from 'next/navigation';
import ProfileImage from '@/components/ui/ProfileImage';

interface IHeaderProps {
    headeruser?: {
        id: string;
        username: string;
        email: string;
        role: 'SUPER_ADMIN' | 'ADMIN_BANI' | 'ADMIN_KELUARGA' | 'MEMBER';
        person?: {
            id: string;
            fullName: string;
            baniId: string;
            photo?: string;
        };
    };
}

const Header = ({ headeruser }: IHeaderProps) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [search, setSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    interface Notification {
        id: string;
        message: string;
        createdAt: string;
    }
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoadingNotif, setIsLoadingNotif] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const user = useSelector((state: IRootState) => state.user.user);

    // Fetch notifications when component mounts
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Fetch notifications from backend
    const fetchNotifications = async () => {
        try {
            setIsLoadingNotif(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                setNotifications(data.data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoadingNotif(false);
        }
    };

    // Remove notification
    const removeNotification = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setNotifications(notifications.filter((item) => item.id !== id));
            }
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    };

    // Search functionality with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery) {
                try {
                    setIsSearching(true);
                    const token = localStorage.getItem('token');
                    if (!token) return;

                    const response = await fetch(`/api/persons/search?query=${searchQuery}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    
                    if (data.status === 'success') {
                        setSearchResults(data.data.persons);
                    }
                } catch (error) {
                    console.error('Error searching:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Handle logout
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                router.push('/auth/login');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header className={themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}>
            <div className="shadow-sm">
                <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/assets/images/logo.svg" alt="logo" />
                            <span className="align-middle text-2xl font-semibold transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">Baniku Web</span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconMenu className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto sm:w-[40%] relative">
                            <form
                                className={`${search && '!block'} absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setSearch(false);
                                }}
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="peer form-input bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pl-9 rtl:pr-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4 w-full"
                                        placeholder="Cari anggota keluarga..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="button" className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto">
                                        <IconSearch className="mx-auto" />
                                    </button>
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            className="absolute top-1/2 -translate-y-1/2 hover:opacity-80 ltr:right-2 rtl:left-2"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <IconXCircle />
                                        </button>
                                    )}
                                </div>

                                {/* Search Results Dropdown */}
                                {searchQuery && (
                                    <div className="absolute top-full left-0 right-0 bg-white dark:bg-black shadow-lg rounded-lg mt-1 max-h-96 overflow-y-auto">
                                        {isSearching ? (
                                            <div className="p-4">
                                                <div className="animate-pulse flex space-x-4">
                                                    <div className="flex-1 space-y-4 py-1">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.map((person: any) => (
                                                <Link
                                                    key={person.id}
                                                    href={`/silsilah/detail/${person.id}`}
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                >
                                                    <div className="font-semibold">{person.fullName}</div>
                                                    <div className="text-sm text-gray-500">{person.bani?.name}</div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                Tidak ada hasil ditemukan
                                            </div>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>

                        <div>
                            {themeConfig.theme === 'light' && (
                                <button
                                    className="rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                                    onClick={() => dispatch(toggleTheme('dark'))}
                                >
                                    <IconSun className="h-5 w-5" />
                                </button>
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className="rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                                    onClick={() => dispatch(toggleTheme('system'))}
                                >
                                    <IconMoon className="h-5 w-5" />
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className="rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                                    onClick={() => dispatch(toggleTheme('light'))}
                                >
                                    <IconLaptop className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement="bottom-end"
                                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <span>
                                        <IconBellBing />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                                <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                                <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                                            </span>
                                        )}
                                    </span>
                                }
                            >
                                <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
                                    <li>
                                        <div className="flex items-center justify-between px-4 py-2 font-semibold">
                                            <h4 className="text-lg">Notifikasi</h4>
                                            {notifications.length > 0 && <span className="badge bg-primary/80">{notifications.length} Baru</span>}
                                        </div>
                                    </li>
                                    {isLoadingNotif ? (
                                        <li className="dark:text-white-light/90">
                                            <div className="p-4">
                                                <div className="animate-pulse flex space-x-4">
                                                    <div className="flex-1 space-y-4 py-1">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ) : notifications.length > 0 ? (
                                        <>
                                            {notifications.map((notification: any) => (
                                                <li key={notification.id} className="dark:text-white-light/90">
                                                    <div className="group flex items-center px-4 py-2">
                                                        <div className="flex flex-auto">
                                                            <div className="ltr:pl-3 rtl:pr-3">
                                                                <div>{notification.message}</div>
                                                                <div className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
                                                                onClick={() => removeNotification(notification.id)}
                                                            >
                                                                <IconXCircle />
                                                                </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                            <li>
                                                <div className="p-4">
                                                    <Link href="/notifications" className="btn btn-primary btn-small block w-full">
                                                        Lihat Semua Notifikasi
                                                    </Link>
                                                </div>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                                                <div className="mx-auto mb-4 rounded-full text-primary ring-4 ring-primary/30">
                                                    <IconInfoCircle className="h-10 w-10" />
                                                </div>
                                                Tidak ada notifikasi.
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </Dropdown>
                        </div>

                        <div className="dropdown flex shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement="bottom-end"
                                btnClassName="relative group block"
                                button={
                                    <ProfileImage 
                                        src={user?.person?.photo} 
                                        className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" 
                                        alt="user profile" 
                                    />
                                }
                            >
                                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            <ProfileImage 
                                                src={user?.person?.photo} 
                                                className="h-10 w-10 rounded-md object-cover" 
                                                alt="user profile" 
                                            />
                                            <div className="truncate ltr:pl-4 rtl:pr-4">
                                                <h4 className="text-base">
                                                    {user?.person?.fullName || user?.username}
                                                    <span className="rounded bg-success-light px-1 text-xs text-success ltr:ml-2 rtl:ml-2">
                                                    {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 
                             user?.role === 'ADMIN_BANI' ? 'Admin Bani' : 
                             user?.role === 'ADMIN_KELUARGA' ? 'Admin Keluarga' : 'Member'}
                                                    </span>
                                                </h4>
                                                <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                    {user?.email || 'user@mail.com'}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/profile" className="dark:hover:text-white">
                                            <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Profile
                                        </Link>
                                    </li>
                                    <li className="border-t border-white-light dark:border-white-light/10">
                                        <button onClick={handleLogout} className="!py-3 text-danger flex items-center w-full">
                                            <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                                            Keluar
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;