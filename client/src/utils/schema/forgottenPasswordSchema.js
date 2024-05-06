import { z } from 'zod';

export const forgottenPasswordSchema = z.object({
  username: z.string().min(4).max(20),
  email: z.string().email(),
});
