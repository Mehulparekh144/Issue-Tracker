import z from "zod";

export const userObjectSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  emailVerified: z.boolean().nullable(),
  image: z.string().nullable(),
  password: z.string(),
  teamId: z.string().nullable(),
});

export type UserObjectSchema = z.infer<typeof userObjectSchema>