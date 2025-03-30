// start of frontend/components/modals/UnsavedChangesModal.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../ui/Modal';

interface UnsavedChangesModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
    show,
    onClose,
    onConfirm
}) => {
    return (
        <Modal
            open={show}
            onClose={onClose}
            title="Perubahan Belum Tersimpan"
            size="md"
        >
            <div className="p-6">
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Anda memiliki perubahan yang belum tersimpan. Apakah Anda yakin ingin meninggalkan halaman ini?
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onConfirm}
                    >
                        Tinggalkan Halaman
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UnsavedChangesModal;
// end of frontend/components/modals/UnsavedChangesModal.tsx