// start of frontend/components/events/EventCalendar.tsx
'use client';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useSelector } from 'react-redux';
import IconPlus from '@/components/icon/icon-plus';
import IconCalendar from '@/components/icon/icon-calendar';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/alert';
import Select from '@/components/forms/Select';
import InputField from '@/components/forms/InputField';
import DatePicker from '@/components/forms/DatePicker';
import StoryEditor from '@/components/forms/StoryEditor';
import { EventData, EventType, EventVisibility, BaniData } from './types';
import { showToast } from '@/components/ui/toast';
import { useAuth } from '@/components/layouts/provider-component';

const calendarStyles = `
  /* Styling untuk header hari */
  .fc-col-header-cell {
    background-color: var(--primary-light) !important;
    padding: 12px 0;
  }
  
  .fc-day-sat .fc-col-header-cell-cushion,
  .fc-day-sun .fc-col-header-cell-cushion {
    color: #e11d48 !important;
  }

  /* Styling untuk tanggal */
  .fc-day-sat, .fc-day-sun {
    background-color: #fef2f2 !important;
  }
  
  .fc-day-sat .fc-daygrid-day-number,
  .fc-day-sun .fc-daygrid-day-number {
    color: #e11d48 !important;
  }

  /* Styling untuk event dots dan title */
  .fc-event {
    border: none !important;
    background: transparent !important;
  }

  .fc-daygrid-event-dot {
    border-width: 6px !important;
    margin: 0 4px !important;
  }

  .fc-event-title {
    font-weight: 500 !important;
  }

  /* Hari ini */
  .fc-day-today {
    background-color: rgba(96, 165, 250, 0.2) !important;
  }

  .fc-day-today .fc-daygrid-day-number {
    background-color: var(--primary) !important;
    color: blue !important;
    width: 25px !important;
    height: 25px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 5px !important;
  }

  /* Title styling */
  .fc-toolbar-title {
    font-size: 1.25rem !important;
    font-weight: 600 !important;
    color: var(--primary) !important;
    cursor: pointer !important;
    padding: 4px 12px !important;
    border-radius: 6px !important;
    transition: background-color 0.2s !important;
  }

  .fc-toolbar-title:hover {
    background-color: var(--primary-light) !important;
  }

  /* Today button styling */
  .fc-today-button {
    background-color: var(--primary) !important;
    border-color: var(--primary) !important;
  }

  /* Event dots by type */
  .event-reunion-akbar .fc-daygrid-event-dot {
    border-color: var(--primary) !important;
  }
  
  .event-bani-gathering .fc-daygrid-event-dot {
    border-color: var(--success) !important;
  }
  
  .event-wedding .fc-daygrid-event-dot {
    border-color: #ec4899 !important;
  }
  
  .event-birthday .fc-daygrid-event-dot {
    border-color: var(--info) !important;
  }
  
  .event-other .fc-daygrid-event-dot {
    border-color: var(--secondary) !important;
  }
`;

const EVENT_COLORS = {
    REUNION_AKBAR: 'bg-primary-600 hover:bg-primary-700',
    BANI_GATHERING: 'bg-success-600 hover:bg-success-700',
    WEDDING: 'bg-pink-600 hover:bg-pink-700',
    BIRTHDAY: 'bg-info-600 hover:bg-info-700',
    OTHER: 'bg-secondary-600 hover:bg-secondary-700'
};

const EVENT_TYPES = [
    { value: 'REUNION_AKBAR', label: 'Reuni Akbar', roleRequired: 'SUPER_ADMIN' },
    { value: 'BANI_GATHERING', label: 'Kumpul Bani', roleRequired: 'ADMIN' },
    { value: 'WEDDING', label: 'Pernikahan', roleRequired: 'ADMIN' },
    { value: 'BIRTHDAY', label: 'Ulang Tahun', roleRequired: 'ADMIN' },
    { value: 'OTHER', label: 'Lainnya', roleRequired: 'ADMIN' }
];

const VISIBILITY_TYPES = [
    { value: 'ALL', label: 'Semua Member' },
    { value: 'SELECTED_BANI', label: 'Bani Tertentu' },
    { value: 'SINGLE_BANI', label: 'Bani Sendiri' }
];

interface EventFormData {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    type: EventType;
    visibility: EventVisibility;
    invitedBanis: string[];
}

// Komponen untuk date picker modal
const MonthYearPicker: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentDate: Date;
    onSelect: (date: Date) => void;
  }> = ({ isOpen, onClose, currentDate, onSelect }) => {
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth());
    
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const years = Array.from({ length: 10 }, (_, i) => year - 5 + i);
    
    const handleSelect = () => {
      onSelect(new Date(year, month, 1));
      onClose();
    };
    
    return (
      <Modal
        open={isOpen}
        onClose={onClose}
        title="Pilih Bulan & Tahun"
        size="sm"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Bulan</label>
              <Select
                options={months.map((name, index) => ({ value: index.toString(), label: name }))}
                value={month.toString()}
                onChange={(value) => setMonth(parseInt(value))}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Tahun</label>
              <Select
                options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
                value={year.toString()}
                onChange={(value) => setYear(parseInt(value))}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              variant="solid"
              onClick={handleSelect}
            >
              Terapkan
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

const EventAlerts: React.FC<{ events: EventData[]; onEventClick: (date: Date) => void }> = ({ 
    events, 
    onEventClick 
}) => {
    const mandatoryEvents = events.filter(event => event.type === 'REUNION_AKBAR');
    const upcomingEvents = events
        .filter(event => event.type !== 'REUNION_AKBAR' && new Date(event.startDate) > new Date())
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 3);

    return (
        <div className="space-y-4 mb-6">
            {mandatoryEvents.map(event => (
                <div 
                    key={event.id}
                    onClick={() => onEventClick(new Date(event.startDate))}
                    className="cursor-pointer"
                >
                    <Alert
                        type="solid"
                        color="primary"
                        icon={<IconCalendar className="w-5 h-5" />}
                        closeBtn={false}
                    >
                        <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm">
                                {new Date(event.startDate).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </Alert>
                </div>
            ))}

            {upcomingEvents.map(event => (
                <div 
                    key={event.id}
                    onClick={() => onEventClick(new Date(event.startDate))}
                    className="cursor-pointer"
                >
                    <Alert
                        type="outline"
                        color="info"
                        icon={<IconCalendar className="w-5 h-5" />}
                    >
                        <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm">
                                {new Date(event.startDate).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </Alert>
                </div>
            ))}
        </div>
    );
};

const EventCalendar = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [baniList, setBaniList] = useState<BaniData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        type: 'OTHER',
        visibility: 'SINGLE_BANI',
        invitedBanis: []
    });
    const [error, setError] = useState<string>('');
    const calendarRef = useRef<any>(null);

    const { user, isLoading: isAuthLoading } = useAuth();
    const userRole = user?.role || 'MEMBER';
    const userBaniId = user?.baniId || '';

    const goToDate = (date: Date) => {
        if (calendarRef.current) {
            calendarRef.current.getApi().gotoDate(date);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchBaniList();
    }, []);

    useEffect(() => {
        // Attach click handler to the title after calendar is rendered
        if (calendarRef.current) {
            setTimeout(() => {
              const titleElement = document.querySelector('.fc-toolbar-title');
              if (titleElement) {
                titleElement.addEventListener('click', handleTitleClick);
              }
            }, 500); // Give time for the calendar to fully render
          }
        }, [calendarRef.current]);

    const handleTitleClick = () => {
        // Handle title click - open date picker modal
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            setSelectedDate(calendarApi.getDate());
            setIsDatePickerOpen(true);    
            
        }
    };

    const handleMonthYearSelect = (date: Date) => {
        if (calendarRef.current) {
          calendarRef.current.getApi().gotoDate(date);
        }
      };

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            
            const filteredEvents = data.events.filter((event: EventData) => {
                if (userRole === 'SUPER_ADMIN') return true;
                if (event.visibility === 'ALL') return true;
                if (event.visibility === 'SINGLE_BANI' && event.baniId === userBaniId) return true;
                if (event.visibility === 'SELECTED_BANI' && event.invitedBanis?.includes(userBaniId)) return true;
                return false;
            });

            setEvents(filteredEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Gagal mengambil data event');
        } finally {
            setLoading(false);
        }
    };

    const fetchBaniList = async () => {
        try {
            const response = await fetch('/api/banis');
            const data = await response.json();
            setBaniList(data.banis);
        } catch (error) {
            console.error('Error fetching bani list:', error);
        }
    };

    const handleEventClick = (info: any) => {
        const event = events.find(e => e.id === info.event.id);
        if (event) {
            setSelectedEvent(event);
            setFormData({
                title: event.title,
                description: event.description || '',
                startDate: typeof event.startDate === 'string' ? event.startDate : event.startDate.toISOString(),
                endDate: typeof event.endDate === 'string' ? event.endDate : event.endDate.toISOString(),
                location: event.location || '',
                type: event.type,
                visibility: event.visibility,
                invitedBanis: event.invitedBanis || []
            });
            setIsModalOpen(true);
        }
    };

    const handleDateSelect = (selectInfo: any) => {
        if (userRole === 'MEMBER') return;

        setSelectedEvent(null);
        setFormData({
            ...formData,
            startDate: selectInfo.startStr,
            endDate: selectInfo.endStr
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const endpoint = selectedEvent ? `/api/events/${selectedEvent.id}` : '/api/events';
            const method = selectedEvent ? 'PUT' : 'POST';
            
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    baniId: userBaniId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save event');
            }

            await fetchEvents();
            setIsModalOpen(false);
            setSelectedEvent(null);
            showToast('success', selectedEvent ? 'Event berhasil diperbarui' : 'Event baru berhasil dibuat');
        } catch (error) {
            console.error('Error saving event:', error);
            setError('Gagal menyimpan event');
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent) return;

        try {
            const response = await fetch(`/api/events/${selectedEvent.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            await fetchEvents();
            setIsModalOpen(false);
            setSelectedEvent(null);
            showToast('success', 'Event berhasil dihapus');
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Gagal menghapus event');
        }
    };

    if (isAuthLoading || loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <EventAlerts events={events} onEventClick={goToDate} />
            
            <div className="panel p-4">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                        <div className="flex flex-wrap items-center gap-3">
                            {EVENT_TYPES.map(type => (
                                <span key={type.value} className="flex items-center">
                                    <span className={`h-3 w-3 rounded-full mr-2 ${EVENT_COLORS[type.value as keyof typeof EVENT_COLORS]}`}></span>
                                    {type.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {userRole !== 'MEMBER' && (
                        <Button 
                            variant="solid"
                            color="primary"
                            onClick={() => {
                                setSelectedEvent(null);
                                setFormData({
                                    title: '',
                                    description: '',
                                    startDate: '',
                                    endDate: '',
                                    location: '',
                                    type: 'OTHER',
                                    visibility: 'SINGLE_BANI',
                                    invitedBanis: []
                                });
                                setIsModalOpen(true);
                            }}
                        >
                            <IconPlus className="w-4 h-4 mr-2" />
                            Tambah Event
                        </Button>
                    )}
                </div>

                <style>{calendarStyles}</style>
                <div className="calendar-wrapper">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        locale="id"
                        events={events.map(event => ({
                            id: event.id,
                            title: event.title,
                            start: event.startDate,
                            end: event.endDate,
                            display: 'list-item',
                            className: `event-${event.type.toLowerCase()}`,
                            extendedProps: {
                                type: event.type
                            }
                        }))}
                        eventDidMount={(info) => {
                            // Tambahkan custom dot sesuai tipe event
                            const dot = document.createElement('div');
                            dot.classList.add(`event-dot-${info.event.extendedProps.type.toLowerCase()}`);
                            info.el.prepend(dot);
                        }}
                        dayHeaderFormat={{ weekday: 'long' }}
                        titleFormat={{ year: 'numeric', month: 'long' }}
                        editable={userRole !== 'MEMBER'}
                        selectable={userRole !== 'MEMBER'}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        eventClick={handleEventClick}
                        select={handleDateSelect}
                    />
                </div>

                {/* Modal Form */}
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={selectedEvent ? 'Edit Event' : 'Tambah Event Baru'}
                    size="xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <InputField
                            label="Judul Event"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DatePicker
                                label="Tanggal Mulai"
                                required
                                value={formData.startDate}
                                onChange={(dates) => setFormData({ 
                                    ...formData, 
                                    startDate: dates[0] ? dates[0].toISOString() : '' 
                                })}
                            />

                            <DatePicker
                                label="Tanggal Selesai"
                                required
                                value={formData.endDate}
                                onChange={(dates) => setFormData({ 
                                    ...formData, 
                                    endDate: dates[0] ? dates[0].toISOString() : '' 
                                })}
                            />
                        </div>

                        <InputField
                            label="Lokasi"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />

                        <Select
                            label="Tipe Event"
                            required
                            options={EVENT_TYPES.filter(type => {
                                if (type.roleRequired === 'SUPER_ADMIN') {
                                    return userRole === 'SUPER_ADMIN';
                                }
                                return userRole !== 'MEMBER';
                            })}
                            value={formData.type}
                            onChange={(value) => setFormData({ ...formData, type: value as EventType })}
                        />

                        <Select
                            label="Visibilitas"
                            required
                            options={VISIBILITY_TYPES.filter(type => {
                                if (userRole === 'SUPER_ADMIN') return true;
                                return ['SINGLE_BANI', 'SELECTED_BANI'].includes(type.value);
                            })}
                            value={formData.visibility}
                            onChange={(value) => setFormData({ ...formData, visibility: value as EventVisibility })}
                        />

                        {formData.visibility === 'SELECTED_BANI' && (
                            <Select
                                label="Bani yang Diundang"
                                isMulti
                                options={baniList.map(bani => ({
                                    value: bani.id,
                                    label: bani.name
                                }))}
                                value={formData.invitedBanis}
                                onChange={(values) => setFormData({ ...formData, invitedBanis: values })}
                            />
                        )}

                        <StoryEditor
                            label="Deskripsi Event"
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                        />

                        {error && (
                            <Alert 
                                type="outline" 
                                color="danger"
                                className="mt-4"
                            >
                                {error}
                            </Alert>
                        )}

                        <div className="flex justify-end gap-2 mt-6">
                            {selectedEvent && (
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
                                onClick={() => setIsModalOpen(false)}
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
            </div>
        </div>
    );
};

export default EventCalendar;
// end of frontend/components/events/EventCalendar.tsx