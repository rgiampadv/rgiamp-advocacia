import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

export const schedulingFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  preferredDate: z.string().min(1, "Selecione uma data"),
  preferredTime: z.string().min(1, "Selecione um horário"),
  subject: z.string().optional(),
  paymentMethod: z.enum(["boleto", "pix", "card"]).optional().default("boleto"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SchedulingFormData = z.infer<typeof schedulingFormSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
