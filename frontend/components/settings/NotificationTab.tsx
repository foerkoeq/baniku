// start of frontend/components/settings/NotificationTab.tsx
import React from 'react';
import Button from '../ui/button';

export default function NotificationTab() {
    return (
        <div className="max-w-2xl">
            <h2 className="mb-6 text-lg font-semibold">Preferensi Notifikasi</h2>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                    <div>
                        <p className="font-medium">Update Keluarga</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notifikasi saat ada penambahan atau perubahan data keluarga
                        </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                    <div>
                        <p className="font-medium">Event Bani</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notifikasi saat ada event atau acara keluarga baru
                        </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"></div>
                    </label>
                </div>

                <div className="pt-4">
                    <Button type="submit">
                        Simpan Pengaturan
                    </Button>
                </div>
            </div>
        </div>
    );
}
// end of frontend/components/settings/NotificationTab.tsx