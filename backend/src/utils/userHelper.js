// start of backend/src/utils/userHelper.js
// Enum untuk Role
const Role = {
  SUPER_ADMIN: 1,
  ADMIN_BANI: 2,
  ADMIN_KELUARGA: 3,
  MEMBER: 4,
  GUEST: 5
};

function generateDefaultUsername(fullName, birthDate) {
  // Ambil kata terakhir dari nama lengkap
  const nameParts = fullName.toLowerCase().split(' ');
  const lastName = nameParts[nameParts.length - 1];
  
  // Format tanggal lahir: DDMMYY
  const day = birthDate.getDate().toString().padStart(2, '0');
  const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
  const year = birthDate.getFullYear().toString().slice(-2);
  
  return `${lastName}${day}${month}${year}`;
}

function determineUserRole(person) {
  console.log('[UserHelper] Menentukan role untuk person:', person);
  
  if (person.isBani) {
    console.log('[UserHelper] Person.isBani = true, memberikan role ADMIN_BANI');
    return Role.ADMIN_BANI;
  } else if (person.familyRole === 'HEAD' && !person.isBani) {
    console.log('[UserHelper] Person.familyRole = HEAD, memberikan role ADMIN_KELUARGA');
    return Role.ADMIN_KELUARGA;
  } else {
    console.log('[UserHelper] Memberikan role default MEMBER');
    return Role.MEMBER;
  }
}

// Helpers untuk verifikasi role
function isSuperAdmin(role) {
  return role === Role.SUPER_ADMIN;
}

function isAdminBani(role) {
  return role === Role.ADMIN_BANI;
}

function isAdminKeluarga(role) {
  return role === Role.ADMIN_KELUARGA;
}

function isMember(role) {
  return role === Role.MEMBER;
}

function isGuest(role) {
  return role === Role.GUEST;
}

function hasAdminRights(role) {
  return role <= Role.ADMIN_KELUARGA;
}

// Fungsi untuk mengkonversi role number ke string
function roleToString(role) {
  return Object.keys(Role).find(key => Role[key] === role) || 'MEMBER';
}

// Fungsi untuk mengkonversi string role ke number
function stringToRole(roleStr) {
  return Role[roleStr] || Role.MEMBER;
}

module.exports = {
  Role,
  generateDefaultUsername,
  determineUserRole,
  isSuperAdmin,
  isAdminBani,
  isAdminKeluarga,
  isMember,
  isGuest,
  hasAdminRights,
  roleToString,
  stringToRole
};
// end of backend/src/utils/userHelper.js