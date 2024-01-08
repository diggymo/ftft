import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});

export type User = z.infer<typeof UserSchema>;
