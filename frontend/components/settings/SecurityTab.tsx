// start of frontend/components/settings/SecurityTab.tsx
import React, { useState } from 'react';
import Button from '../ui/button';
import Alert from '../ui/alert';
import InputField from '../forms/InputField';

export default function SecurityTab() {
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // API call untuk update password
            setSuccess('Password berhasil diperbarui');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-2xl">
            <h2 className="mb-6 text-lg font-semibold">Ubah Password</h2>

            {success && (
                <Alert 
                    type="outline"
                    color="success"
                    className="mb-4"
                >
                    {success}
                </Alert>
            )}

            {error && (
                <Alert 
                    type="outline"
                    color="danger"
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="Password Saat Ini"
                    type="password"
                    name="currentPassword"
                    required
                />

                <InputField
                    label="Password Baru"
                    type="password"
                    name="newPassword"
                    required
                />

                <InputField
                    label="Konfirmasi Password Baru"
                    type="password"
                    name="confirmPassword"
                    required
                />

                <div className="flex justify-end pt-4">
                    <Button type="submit">
                        Perbarui Password
                    </Button>
                </div>
            </form>
        </div>
    );
}
// end of frontend/components/settings/SecurityTab.tsx