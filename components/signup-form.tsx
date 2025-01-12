"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "" })
    .refine(
      (name) => {
        const words = name.trim().split(/\s+/);
        return words.length >= 2;
      },
      { message: "Please enter both your first and last name" }
    ),
  email: z
    .string()
    .min(1, { message: "" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "" })
    .refine(
      (password) => {
        return (
          password.length >= 8 &&
          /[A-Z]/.test(password) &&
          /[0-9]/.test(password) &&
          /[^A-Za-z0-9]/.test(password)
        );
      },
      { message: "" }
    ),
});

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"initial" | "password">("initial");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: async (values, context, options) => {
      if (currentStep === "initial") {
        // Only validate fullName and email in the first step
        return zodResolver(
          z.object({
            fullName: formSchema.shape.fullName,
            email: formSchema.shape.email,
            password: z.string().optional(), // Make password optional in first step
          })
        )(values, context, options);
      }
      // Validate everything in the final step
      return zodResolver(formSchema)(values, context, options);
    },
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Processing submission for step:", currentStep);

    if (currentStep === "initial") {
      console.log("Initial step submission", values);
      setCurrentStep("password");
    } else {
      setIsLoading(true);
      try {
        // This is where you'll eventually add your Supabase signup logic
        console.log("Final submission:", values);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div
      className={cn("grid gap-6", className)}
      {...props}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <Label
                  className="sr-only"
                  htmlFor="fullName"
                >
                  Full name
                </Label>
                <FormControl>
                  <Input
                    {...field}
                    id="fullName"
                    placeholder="Full name"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading || currentStep === "password"}
                    onChange={(e) => {
                      field.onChange(e);
                      form.clearErrors("fullName");
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label
                  className="sr-only"
                  htmlFor="email"
                >
                  Email
                </Label>
                <FormControl>
                  <Input
                    {...field}
                    id="email"
                    placeholder="Email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading || currentStep === "password"}
                    onChange={(e) => {
                      field.onChange(e);
                      form.clearErrors("email");
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {currentStep === "password" && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label
                    className="sr-only"
                    htmlFor="password"
                  >
                    Password
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        disabled={isLoading}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  {(isPasswordFocused || field.value.length > 0) &&
                    !(
                      field.value.length >= 8 &&
                      /[A-Z]/.test(field.value) &&
                      /[0-9]/.test(field.value) &&
                      /[^A-Za-z0-9]/.test(field.value)
                    ) && (
                      <ul className="text-sm mt-2 space-y-1">
                        <li className={field.value.length >= 8 ? "text-green-500" : "text-red-500"}>
                          • At least 8 characters
                        </li>
                        <li
                          className={/[A-Z]/.test(field.value) ? "text-green-500" : "text-red-500"}
                        >
                          • One uppercase letter
                        </li>
                        <li
                          className={/[0-9]/.test(field.value) ? "text-green-500" : "text-red-500"}
                        >
                          • One number
                        </li>
                        <li
                          className={
                            /[^A-Za-z0-9]/.test(field.value) ? "text-green-500" : "text-red-500"
                          }
                        >
                          • One special character
                        </li>
                      </ul>
                    )}
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStep === "initial" ? "Continue" : "Create account"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => console.log("Google sign in")}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign up with Google
      </Button>
    </div>
  );
}
