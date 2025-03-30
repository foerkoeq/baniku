// start of frontend/components/events/EventDetailsSection.tsx
'use client';
import React from 'react';
import InputField from '@/components/forms/InputField';
import Select from '@/components/forms/Select';
import Button from '@/components/ui/button';
import { EventDetails, EventScheduleItem } from './types';
import IconX from '../icon/icon-x';

interface EventDetailsSectionProps {
    details: EventDetails;
    onUpdate: (details: EventDetails) => void;
    canEdit: boolean;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
    details,
    onUpdate,
    canEdit
}) => {
    const handleScheduleUpdate = (items: EventScheduleItem[]) => {
        onUpdate({
            ...details,
            schedule: items
        });
    };

    return (
        <div className="space-y-6">
            {/* Venue Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-4">Informasi Tempat</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Tipe Tempat"
                        options={[
                            { value: 'BUILDING', label: 'Gedung' },
                            { value: 'HOME', label: 'Rumah' },
                            { value: 'OTHER', label: 'Lainnya' }
                        ]}
                        value={details.venue.type}
                        onChange={(value) => 
                            onUpdate({
                                ...details,
                                venue: { ...details.venue, type: value }
                            })
                        }
                        isDisabled={!canEdit}
                    />

                    <InputField
                        label="Nama Tempat"
                        value={details.venue.name}
                        onChange={(e) => 
                            onUpdate({
                                ...details,
                                venue: { ...details.venue, name: e.target.value }
                            })
                        }
                        disabled={!canEdit}
                    />

                    <div className="md:col-span-2">
                        <InputField
                            label="Alamat Lengkap"
                            value={details.venue.address}
                            onChange={(e) => 
                                onUpdate({
                                    ...details,
                                    venue: { ...details.venue, address: e.target.value }
                                })
                            }
                            disabled={!canEdit}
                        />
                    </div>

                    <InputField
                        label="Informasi Parkir"
                        value={details.venue.parkingInfo}
                        onChange={(e) => 
                            onUpdate({
                                ...details,
                                venue: { ...details.venue, parkingInfo: e.target.value }
                            })
                        }
                        disabled={!canEdit}
                    />

                    <InputField
                        label="Petunjuk Arah"
                        value={details.venue.directions}
                        onChange={(e) => 
                            onUpdate({
                                ...details,
                                venue: { ...details.venue, directions: e.target.value }
                            })
                        }
                        disabled={!canEdit}
                    />
                </div>
            </div>

            {/* Schedule/Rundown */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Rundown Acara</h4>
                    {canEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newSchedule = [...details.schedule, {
                                    id: Date.now().toString(),
                                    startTime: '',
                                    endTime: '',
                                    activity: '',
                                    description: ''
                                }];
                                handleScheduleUpdate(newSchedule);
                            }}
                        >
                            Tambah Acara
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {details.schedule.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
                            <div className="col-span-2">
                                <InputField
                                    type="time"
                                    value={item.startTime}
                                    onChange={(e) => {
                                        const newSchedule = [...details.schedule];
                                        newSchedule[index].startTime = e.target.value;
                                        handleScheduleUpdate(newSchedule);
                                    }}
                                    disabled={!canEdit}
                                />
                            </div>
                            <div className="col-span-2">
                                <InputField
                                    type="time"
                                    value={item.endTime}
                                    onChange={(e) => {
                                        const newSchedule = [...details.schedule];
                                        newSchedule[index].endTime = e.target.value;
                                        handleScheduleUpdate(newSchedule);
                                    }}
                                    disabled={!canEdit}
                                />
                            </div>
                            <div className="col-span-7">
                                <InputField
                                    value={item.activity}
                                    onChange={(e) => {
                                        const newSchedule = [...details.schedule];
                                        newSchedule[index].activity = e.target.value;
                                        handleScheduleUpdate(newSchedule);
                                    }}
                                    placeholder="Nama acara"
                                    disabled={!canEdit}
                                />
                                <InputField
                                    value={item.description || ''}
                                    onChange={(e) => {
                                        const newSchedule = [...details.schedule];
                                        newSchedule[index].description = e.target.value;
                                        handleScheduleUpdate(newSchedule);
                                    }}
                                    placeholder="Deskripsi (opsional)"
                                    disabled={!canEdit}
                                />
                            </div>
                            {canEdit && (
                                <div className="col-span-1">
                                    <Button
                                        variant="outline"
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                            const newSchedule = details.schedule.filter((_, i) => i !== index);
                                            handleScheduleUpdate(newSchedule);
                                        }}
                                    >
                                        <IconX className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-4">Informasi Tambahan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Dresscode"
                        value={details.additionalInfo?.dresscode}
                        onChange={(e) => 
                            onUpdate({
                                ...details,
                                additionalInfo: {
                                    ...details.additionalInfo,
                                    dresscode: e.target.value
                                }
                            })
                        }
                        disabled={!canEdit}
                    />

                    <div className="md:col-span-2">
                        <InputField
                            label="Catatan Khusus"
                            value={details.additionalInfo?.specialNotes}
                            onChange={(e) => 
                                onUpdate({
                                    ...details,
                                    additionalInfo: {
                                        ...details.additionalInfo,
                                        specialNotes: e.target.value
                                    }
                                })
                            }
                            disabled={!canEdit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsSection;
// end of frontend/components/events/EventDetailsSection.tsx