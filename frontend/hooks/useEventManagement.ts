// start of frontend/hooks/useEventManagement.ts
import { useState } from 'react';
import { EventData, EventFormData } from '@/components/events/types';

export const useEventManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createEvent = async (formData: EventFormData): Promise<EventData | null> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            const data = await response.json();
            return data.event;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateEvent = async (id: string, formData: EventFormData): Promise<EventData | null> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update event');
            }

            const data = await response.json();
            return data.event;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update event');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteEvent = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete event');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        createEvent,
        updateEvent,
        deleteEvent,
    };
};

export default useEventManagement;
// end of frontend/hooks/useEventManagement.ts