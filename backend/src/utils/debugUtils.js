// start of backend/src/utils/debugUtils.js
/**
 * Utilitas untuk membantu debug autentikasi dan role user
 */

// Fungsi debug untuk memeriksa data user dan role
const debugUserRole = (user) => {
    try {
        if (!user) {
            console.log('\x1b[31m%s\x1b[0m', '[DEBUG] User tidak ditemukan');
            return;
        }

        console.log('\x1b[36m%s\x1b[0m', '====== DEBUG USER ROLE ======');
        console.log('\x1b[33m%s\x1b[0m', `ID: ${user.id}`);
        console.log('\x1b[33m%s\x1b[0m', `Username: ${user.username}`);
        console.log('\x1b[33m%s\x1b[0m', `Role: ${user.role}`);
        
        if (user.person) {
            console.log('\x1b[33m%s\x1b[0m', `Person ID: ${user.person.id}`);
            console.log('\x1b[33m%s\x1b[0m', `Full Name: ${user.person.fullName}`);
            console.log('\x1b[33m%s\x1b[0m', `Bani ID: ${user.person.baniId}`);
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Person data tidak ditemukan');
        }
        
        console.log('\x1b[36m%s\x1b[0m', '============================');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error saat debugging user:', error);
    }
};

// Debug untuk respons login
const debugLoginResponse = (token, user) => {
    try {
        console.log('\x1b[36m%s\x1b[0m', '====== DEBUG LOGIN RESPONSE ======');
        console.log('\x1b[33m%s\x1b[0m', `Token: ${token.substring(0, 15)}...`);
        debugUserRole(user);
        console.log('\x1b[36m%s\x1b[0m', '=================================');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error saat debugging login response:', error);
    }
};

module.exports = {
    debugUserRole,
    debugLoginResponse
};
// end of backend/src/utils/debugUtils.js