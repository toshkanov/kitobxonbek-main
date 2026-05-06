import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email noto'g'ri formatda"),
  password: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ism kamida 2 belgidan iborat bo'lishi kerak"),
    email: z.string().email("Email noto'g'ri formatda"),
    password: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Parollar bir xil emas",
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email noto'g'ri formatda"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Parollar bir xil emas",
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
