// start of frontend/types/role.ts
export enum Role {
  SUPER_ADMIN = 1,
  ADMIN_BANI = 2,
  ADMIN_KELUARGA = 3,
  MEMBER = 4,
  GUEST = 5
}

// Tipe string untuk role yang digunakan di API
export type RoleString = keyof typeof Role;

// Fungsi untuk mengkonversi string role ke enum Role
export function stringToRole(roleStr: RoleString): Role {
  return Role[roleStr];
}

// Fungsi untuk mengkonversi enum Role ke string
export function roleToString(role: Role): RoleString {
  return Role[role] as RoleString;
}

// Fungsi untuk mengecek level akses
export function hasAccessLevel(userRole: Role, requiredLevel: Role): boolean {
  return userRole <= requiredLevel;
}

// Fungsi untuk mengecek apakah pengguna adalah admin
export function isAdmin(role: Role): boolean {
  return role <= Role.ADMIN_KELUARGA;
}

// Fungsi untuk mengecek apakah pengguna adalah super admin
export function isSuperAdmin(role: Role): boolean {
  return role === Role.SUPER_ADMIN;
}

// Fungsi untuk mengecek apakah pengguna adalah admin bani
export function isAdminBani(role: Role): boolean {
  return role === Role.ADMIN_BANI;
}

// Fungsi untuk mengecek apakah pengguna adalah admin keluarga
export function isAdminKeluarga(role: Role): boolean {
  return role === Role.ADMIN_KELUARGA;
}

// Fungsi untuk mengecek apakah pengguna adalah member
export function isMember(role: Role): boolean {
  return role === Role.MEMBER;
}

// Fungsi untuk mengecek apakah pengguna adalah guest
export function isGuest(role: Role): boolean {
  return role === Role.GUEST;
}

// Fungsi untuk mendapatkan label role dalam bahasa Indonesia
export function getRoleLabel(role: Role): string {
  const labels = {
    [Role.SUPER_ADMIN]: 'Super Admin',
    [Role.ADMIN_BANI]: 'Admin Bani',
    [Role.ADMIN_KELUARGA]: 'Admin Keluarga',
    [Role.MEMBER]: 'Anggota',
    [Role.GUEST]: 'Tamu'
  };
  return labels[role];
}

// Fungsi untuk mendapatkan daftar role yang diizinkan berdasarkan role user
export function getAllowedRoles(userRole: Role): Role[] {
  const roles = Object.values(Role).filter(value => typeof value === 'number') as Role[];
  return roles.filter(role => role >= userRole);
} 