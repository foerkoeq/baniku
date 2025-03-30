// start of frontend/types/person.ts
export interface Location {
    id: string;
    name: string;
  }
  
  export interface Bani {
    id: string;
    name: string;
  }
  
  export interface Person {
    id: string;
    titlePrefix?: string;
    fullName: string;
    titleSuffix?: string;
    bani?: {
      id: string;
      name: string;
    };
    address?: {
      street?: string;
      province?: {
        id: string;
        name: string;
      };
      city?: {
        id: string;
        name: string;
      };
    };
    provinceId?: string;
    cityId?: string;
    baniId?: string;
    phone?: string;
    status: 'ALIVE' | 'DECEASED';
    note?: string;
  }
  // end of frontend/types/person.ts