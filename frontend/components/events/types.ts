// start of frontend/components/events/types.ts
export type EventType = 'REUNION_AKBAR' | 'BANI_GATHERING' | 'WEDDING' | 'BIRTHDAY' | 'OTHER';

export type EventVisibility = 'ALL' | 'SELECTED_BANI' | 'SINGLE_BANI';

export interface BaniData {
    id: string;
    name: string;
}

export type CommitteeMember = {
    userId: string;
    personId: string;
    fullName: string;
    role: 'HOST' | 'COORDINATOR' | 'MEMBER';
    baniId: string;
};

export type EventScheduleItem = {
    id: string;
    startTime: string;
    endTime: string;
    activity: string;
    description?: string;
    person?: string;
};

export type EventDetails = {
    venue: {
        type: 'BUILDING' | 'HOME' | 'OTHER';
        name: string;
        address: string;
        facilities: string[];
        parkingInfo?: string;
        directions?: string;
    };
    schedule: EventScheduleItem[];
    additionalInfo?: {
        dresscode?: string;
        specialNotes?: string;
        contactPerson?: {
            name: string;
            phone: string;
            role: string;
        }[];
    };
};


export interface EventData {
    id: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    type: EventType;
    visibility: EventVisibility;
    baniId: string; // Bani yang membuat event
    invitedBanis?: string[]; // Bani yang diundang (jika visibility = SELECTED_BANI)
    createdBy: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt?: string;
    committee?: {
        hostBaniId?: string;
        members: CommitteeMember[];
    };
    details?: EventDetails;
}

export interface SelectOption {
    value: string;
    label: string;
    isDisabled?: boolean;
}

export interface EventFormData {
    title: string;
    description?: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string;
    type: EventType;
    visibility: EventVisibility;
    baniId: string;
    invitedBanis?: string[];
    committee?: {
        hostBaniId?: string;
        members: Omit<CommitteeMember, 'fullName'>[];
    };
    details?: EventDetails;
}

// end of frontend/components/events/types.ts