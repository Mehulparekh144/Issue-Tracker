import z from "zod"

export const registerValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email"
  }),
  password: z.string().min(6, { message: "Password must be atleast 6 characters" })
})

export type RegisterValidationSchema = z.infer<typeof registerValidationSchema>

export const loginValidationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email"
  }),
  password: z.string().min(6, { message: "Password must be atleast 6 characters" })
})

export type LoginValidationSchema = z.infer<typeof loginValidationSchema>
