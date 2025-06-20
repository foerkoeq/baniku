// start of frontend/components/debug/RoleDebugger.tsx
'use client';
import { useAuth } from '@/components/layouts/provider-component';
import React, { useState } from 'react';

const RoleDebugger = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // Jika mode production atau tidak ada user, jangan tampilkan debugger
    if (process.env.NODE_ENV === 'production' || !user) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg"
                style={{ width: '2rem', height: '2rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                {isOpen ? 'X' : 'R'}
            </button>
            
            {isOpen && (
                <div className="absolute bottom-12 right-0 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 text-sm" style={{ border: '1px solid #ddd' }}>
                    <h3 className="font-bold text-blue-500 mb-2">Role Debugger</h3>
                    <div className="space-y-2">
                        <div>
                            <span className="font-semibold">Username:</span> {user.username}
                        </div>
                        <div>
                            <span className="font-semibold">Role:</span> 
                            <span className="ml-2 px-2 py-1 rounded text-xs" style={{ 
                                backgroundColor: getRoleColor(user.role).bg, 
                                color: getRoleColor(user.role).text 
                            }}>
                                {user.role}
                            </span>
                        </div>
                        {user.person && (
                            <>
                                <div>
                                    <span className="font-semibold">Full Name:</span> {user.person.fullName}
                                </div>
                                <div>
                                    <span className="font-semibold">Bani ID:</span> {user.person.baniId || 'N/A'}
                                </div>
                            </>
                        )}
                        
                        <div className="pt-2 mt-2" style={{ borderTop: '1px solid #ddd' }}>
                            <div className="text-xs">
                                <div className="font-bold mb-1">Storage Debug:</div>
                                {typeof window !== 'undefined' && (
                                    <>
                                        <div className="flex justify-between">
                                            <span>Local:</span> 
                                            <span>
                                                {localStorage.getItem('user') 
                                                    ? JSON.parse(localStorage.getItem('user') || '{}').role 
                                                    : 'Not found'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Session:</span> 
                                            <span>
                                                {sessionStorage.getItem('user') 
                                                    ? JSON.parse(sessionStorage.getItem('user') || '{}').role 
                                                    : 'Not found'}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper untuk mendapatkan warna background sesuai role
function getRoleColor(role: string): { bg: string, text: string } {
    switch (role) {
        case 'SUPER_ADMIN':
            return { bg: '#fecaca', text: '#991b1b' };
        case 'ADMIN_BANI':
            return { bg: '#e9d5ff', text: '#6b21a8' };
        case 'ADMIN_KELUARGA':
            return { bg: '#fef08a', text: '#854d0e' };
        case 'MEMBER':
            return { bg: '#bbf7d0', text: '#15803d' };
        default:
            return { bg: '#e5e7eb', text: '#1f2937' };
    }
}

export default RoleDebugger;
// end of frontend/components/debug/RoleDebugger.tsx