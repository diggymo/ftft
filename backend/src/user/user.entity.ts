import { z } from 'zod';

export const BaseUserSchema = z.object({
  id: z.string().min(1),
});

export const LineUserSchema = BaseUserSchema.merge(
  z.object({
    lineUserId: z.string().min(1),
  }),
);
export type LineUser = z.infer<typeof LineUserSchema>;

export const EmailUserSchema = BaseUserSchema.merge(
  z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
);

export const UserSchema = LineUserSchema.or(EmailUserSchema);

export type User = z.infer<typeof UserSchema>;
