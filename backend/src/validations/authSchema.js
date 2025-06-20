// start of backend/src/validations/authSchema.js
const { z } = require('zod');

const loginSchema = z.object({
  username: z.string({
    required_error: "Username wajib diisi"
  }).min(3, "Username minimal 3 karakter"),
  password: z.string({
    required_error: "Password wajib diisi"
  }).min(8, "Password minimal 8 karakter")
});

const forgotPasswordSchema = z.object({
  email: z.string({
    required_error: "Email wajib diisi"
  }).email("Format email tidak valid")
});

const resetPasswordSchema = z.object({
  token: z.string({
    required_error: "Token wajib diisi"
  }),
  email: z.string({
    required_error: "Email wajib diisi"
  }).email("Format email tidak valid"),
  newPassword: z.string({
    required_error: "Password baru wajib diisi"
  }).min(8, "Password minimal 8 karakter")
});

module.exports = {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
// end of backend/src/validations/authSchema.js