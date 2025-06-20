// start of frontend/utils/baniHelpers.ts
import { BaniData } from '@/components/events/types';

// Fungsi untuk mendapatkan level bani
export const getBaniLevel = async (baniId: string): Promise<number> => {
    try {
        const response = await fetch(`/api/banis/${baniId}/level`);
        const data = await response.json();
        return data.level;
    } catch (error) {
        console.error('Error getting bani level:', error);
        return 0;
    }
};

// Fungsi untuk mendapatkan bani children
export const getBaniChildren = async (baniId: string): Promise<string[]> => {
    try {
        const response = await fetch(`/api/banis/${baniId}/children`);
        const data = await response.json();
        return data.children.map((child: BaniData) => child.id);
    } catch (error) {
        console.error('Error getting bani children:', error);
        return [];
    }
};

// Fungsi untuk mendapatkan parent bani
export const getBaniParent = async (baniId: string): Promise<string | null> => {
    try {
        const response = await fetch(`/api/banis/${baniId}/parent`);
        const data = await response.json();
        return data.parentId;
    } catch (error) {
        console.error('Error getting bani parent:', error);
        return null;
    }
};
// end of frontend/utils/baniHelpers.ts