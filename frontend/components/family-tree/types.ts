// start of frontend/components/family-tree/types.ts
import { RawNodeDatum } from 'react-d3-tree';
import { Role } from '@/types/role';

// Role pengguna
export type UserRole = 'SUPER_ADMIN' | 'ADMIN_BANI' | 'ADMIN_KELUARGA' | 'MEMBER';

// Status pernikahan
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'REMARRIED';

// Gender
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

// Status hidup
export type LiveStatus = 'ALIVE' | 'DECEASED';

// Tipe relasi
export type RelationType = 'SPOUSE' | 'CHILD' | 'PARENT';

// Informasi pasangan (spouse)
export interface SpouseInfo {
  id: string;
  fullName: string;
  gender: Gender;
  photo?: string;
  status?: LiveStatus;
  marriageDate?: string;
  divorceDate?: string; // Jika sudah bercerai
  isCurrentSpouse: boolean; // Untuk menandai pasangan sekarang jika punya beberapa pasangan
}

// Tipe untuk data node di pohon keluarga
export interface TreeNodeData extends RawNodeDatum {
  id: string;
  fullName?: string;
  nodeType: 'PERSON' | 'PLACEHOLDER';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  photo?: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  status?: 'ALIVE' | 'DECEASED';
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'REMARRIED';
  address?: string;
  phone?: string;
  titlePrefix?: string;
  titleSuffix?: string;
  spouses?: {
    id: string;
    fullName: string;
    isCurrentSpouse: boolean;
  }[];
  children?: TreeNodeData[];
}

// Tipe untuk data yang dikirim saat node diklik
export interface NodeClickData {
  nodeData: TreeNodeData;
  action: 'details' | 'add' | 'edit' | 'expand';
}

// Props untuk komponen FamilyTree
export interface FamilyTreeProps {
  data: TreeNodeData;
  userRole: Role;
  onNodeClick: (data: NodeClickData) => void;
  onAddInitialData?: () => void;
  className?: string;
}

// Props untuk MiniMap
export interface MiniMapProps {
  treeContainerRef: React.RefObject<HTMLDivElement>;
  scale: number;
  translate?: {
    x: number;
    y: number;
  };
  position?: {
    x: number;
    y: number;
  };
}

// Props untuk TreeControls
export interface TreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  scale: number;
}

// Props untuk EmptyTreeGuide
export interface EmptyTreeGuideProps {
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onFinish: () => void;
  userRole: UserRole;
}

// end of frontend/components/family-tree/types.ts