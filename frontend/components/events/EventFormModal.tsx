// start of frontend/components/events/EventFormModal.tsx
'use client';
import React from 'react';
import Modal from '@/components/ui/Modal';
import Select from '@/components/forms/Select';
import InputField from '@/components/forms/InputField';
import DatePicker from '@/components/forms/DatePicker';
import StoryEditor from '@/components/forms/StoryEditor';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import SweetAlert from '@/components/ui/Sweetalert';
import { EventData, EventType, EventVisibility, BaniData } from './types';

interface EventFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedEvent: EventData | null;
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: () => void;
    error?: string;
    userRole: string;
    baniList: BaniData[];
}

const EventFormModal: React.FC<EventFormModalProps> = ({
    isOpen,
    onClose,
    selectedEvent,
    formData,
    setFormData,
    onSubmit,
    onDelete,
    error,
    userRole,
    baniList
}) => {

    // Konfirmasi delete menggunakan SweetAlert
    const handleDelete = () => {
        SweetAlert.fire({
            title: 'Hapus Event?',
            text: 'Event yang dihapus tidak dapat dikembalikan',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-outline-danger ltr:mr-3 rtl:ml-3'
            },
     
        }).then((result: any) => {
            if (result && result.isConfirmed) {
                onDelete();
            }
        });
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={selectedEvent ? 'Edit Event' : 'Tambah Event Baru'} 
            size="xl"
        >
            <form onSubmit={onSubmit} className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Info */}
                    <div className="md:col-span-2">
                        <InputField
                            label="Judul Event"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Masukkan judul event"
                        />
                    </div>

                    {/* Date Selection */}
                    <DatePicker
                        label="Tanggal & Jam Mulai"
                        required
                        value={formData.startDate}
                        onChange={(date) => setFormData({ ...formData, startDate: date })}
                        showTimeInput
                    />

                    <DatePicker
                        label="Tanggal & Jam Selesai"
                        required
                        value={formData.endDate}
                        onChange={(date) => setFormData({ ...formData, endDate: date })}
                        showTimeInput
                        minDate={formData.startDate}
                    />

                    {/* Location */}
                    <div className="md:col-span-2">
                        <InputField
                            label="Lokasi"
                            placeholder="Masukkan lokasi event"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    {/* Event Type */}
                    <Select
                        label="Tipe Event"
                        required
                        options={[
                            { value: 'REUNION_AKBAR', label: 'Reuni Akbar', isDisabled: userRole !== 'SUPER_ADMIN' },
                            { value: 'BANI_GATHERING', label: 'Kumpul Bani' },
                            { value: 'WEDDING', label: 'Pernikahan' },
                            { value: 'BIRTHDAY', label: 'Ulang Tahun' },
                            { value: 'OTHER', label: 'Lainnya' }
                        ]}
                        value={formData.type}
                        onChange={(value) => setFormData({ ...formData, type: value })}
                    />

                    {/* Visibility */}
                    <Select
                        label="Visibilitas"
                        required
                        options={[
                            { value: 'ALL', label: 'Semua Member', isDisabled: userRole !== 'SUPER_ADMIN' },
                            { value: 'SELECTED_BANI', label: 'Bani Tertentu' },
                            { value: 'SINGLE_BANI', label: 'Bani Sendiri' }
                        ]}
                        value={formData.visibility}
                        onChange={(value) => setFormData({ ...formData, visibility: value })}
                    />

                    {/* Invited Banis - Only show if SELECTED_BANI is chosen */}
                    {formData.visibility === 'SELECTED_BANI' && (
                        <div className="md:col-span-2">
                            <Select
                                label="Bani yang Diundang"
                                isMulti
                                required
                                options={baniList.map(bani => ({
                                    value: bani.id,
                                    label: bani.name
                                }))}
                                value={formData.invitedBanis}
                                onChange={(values) => setFormData({ ...formData, invitedBanis: values })}
                                placeholder="Pilih bani yang diundang..."
                            />
                        </div>
                    )}

                    {/* Description */}
                    <div className="md:col-span-2">
                        <StoryEditor
                            label="Deskripsi Event"
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            placeholder="Tambahkan detail event..."
                        />
                    </div>

                    {/* Contact Person */}
                    <InputField
                        label="Kontak Person"
                        placeholder="Nama kontak person"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />

                    <InputField
                        label="No. Telepon"
                        placeholder="No. telepon kontak"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <Alert 
                    type="outline" 
                    color="danger"
                    className="mt-4">
                        {error}
                    </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                    {selectedEvent && userRole !== 'MEMBER' && (
                        <Button
                            variant="outline"
                            color="danger"
                            onClick={handleDelete}
                        >
                            Hapus Event
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                    >
                        {selectedEvent ? 'Update Event' : 'Simpan Event'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EventFormModal;
// end of frontend/components/events/EventFormModal.tsx