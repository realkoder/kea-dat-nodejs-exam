import { z } from 'zod';

export const resetPasswordSchema = z.object({
  secretPhrase: z.string().min(2).max(100),
  newPassword: z.string().min(8).max(20),
  confirmPassword: z.string().min(8).max(20),
});
