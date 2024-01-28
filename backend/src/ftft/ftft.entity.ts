import { BaseUserSchema } from 'src/user/user.entity';
import { z } from 'zod';

export const FtftSchema = z.object({
  id: z.string().min(1),
  userId: BaseUserSchema.shape.id,
  title: z.string().min(1),
  emoji: z.string().min(1).optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  createdAt: z.date(),
  fileKeyList: z.array(z.string().min(1)).optional(),
});

export type Ftft = z.infer<typeof FtftSchema>;
