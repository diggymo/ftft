import { UserSchema } from 'src/user/user.entity';
import { z } from 'zod';

export const FtftSchema = z.object({
  id: z.string().min(1),
  userId: UserSchema.shape.id,
  title: z.string().min(1),
  createdAt: z.date(),
});

export type Ftft = z.infer<typeof FtftSchema>;
