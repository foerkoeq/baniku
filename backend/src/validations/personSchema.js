// start of backend/src/validations/personSchema.js
const { z } = require('zod');

const personSchema = z.object({
  titlePrefix: z.string().optional(),
  fullName: z.string({
    required_error: "Nama lengkap wajib diisi"
  }).min(3, "Nama minimal 3 karakter"),
  titleSuffix: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  birthPlace: z.string().optional(),
  birthDate: z.string().datetime().optional(),
  deathPlace: z.string().optional(),
  deathDate: z.string().datetime().optional(),
  status: z.enum(['ALIVE', 'DECEASED']).default('ALIVE'),
  address: z.string().optional(),
  phone: z.string().optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'REMARRIED']).default('SINGLE'),
  story: z.string().optional(),
  baniId: z.string({
    required_error: "Bani ID wajib diisi"
  }),
  parentId: z.string().optional(),
  spouseId: z.string().optional()
});

module.exports = {
  personSchema
};
// end of backend/src/validations/personSchema.js