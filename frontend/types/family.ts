// start of frontend/types/family.ts
export interface SubFamily {
    id: string;
    name: string;
    totalPeople: number;
    totalFamilies: number;
  }
  
  export interface FamilyStats {
    totalPeople: number;
    totalFamilies: number;
    subFamilies: SubFamily[];
  }
  // end of frontend/types/family.ts