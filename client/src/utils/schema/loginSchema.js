import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(8).max(20), //.regex(/^(?=.*[A-Z])(?=.*[0-9]).*$/)
  secretPhrase: z.string().min(2).max(100).optional(),
});
