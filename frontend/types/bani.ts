// start of frontend/types/bani.ts
export interface Bani {
    id: string;
    name: string;
    level: number;
  }
  
  export interface Person {
    id: string;
    name: string;
    birthDate: string;
    photo: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
  }
  
  export interface BaniStory {
    id: string;
    name: string;
    photos: string[];
    husbandPhoto: string;
    husbandName: string;
    husbandBirthDate: string;
    husbandBirthPlace: string;
    husbandDeathDate: string | null;
    wifePhoto: string;
    wifeName: string;
    wifeBirthDate: string;
    wifeBirthPlace: string;
    wifeDeathDate: string | null;
    marriageDate: string;
    story: string;
    children: Person[];
  }
  // end of frontend/types/bani.ts