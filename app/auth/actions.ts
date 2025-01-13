"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Define server-side validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  fullName: z
    .string()
    .min(1)
    .refine((name) => name.trim().split(/\s+/).length >= 2, {
      message: "Please enter both first and last name",
    }),
});

export async function login(formData: FormData) {
  // Server-side validation
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    // You could handle validation errors differently here
    redirect("/error");
  }

  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: result.data.email,
    password: result.data.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard"); // or '/' if you prefer
}

export async function signup(formData: FormData) {
  // Server-side validation
  const result = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });

  if (!result.success) {
    console.error("Validation error:", result.error);
    redirect("/error");
  }

  const supabase = await createClient();

  const data = {
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.fullName,
      },
    },
  };

  console.log("Attempting signup with:", {
    email: data.email,
    // Don't log password
    options: data.options,
  });

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Supabase signup error:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/verify-email");
}
