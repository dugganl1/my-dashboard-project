"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Define the form schema with Zod
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "" }) // Empty message for required
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "" }) // Empty message for required
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

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit", // Only validate on submit
    reValidateMode: "onChange", // But revalidate on change after submit
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Add your login logic here
  }

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="m@example.com"
                        onBlur={(e) => {
                          field.onBlur();
                          if (e.target.value) {
                            form.trigger("email");
                          }
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          // Clear any existing errors when user starts typing again
                          form.clearErrors("email");
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          onFocus={() => setIsPasswordFocused(true)}
                          onBlur={() => setIsPasswordFocused(false)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
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
                          <li
                            className={field.value.length >= 8 ? "text-green-500" : "text-red-500"}
                          >
                            • At least 8 characters
                          </li>
                          <li
                            className={
                              /[A-Z]/.test(field.value) ? "text-green-500" : "text-red-500"
                            }
                          >
                            • One uppercase letter
                          </li>
                          <li
                            className={
                              /[0-9]/.test(field.value) ? "text-green-500" : "text-red-500"
                            }
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

              <Button
                type="submit"
                className="w-full"
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="w-full"
              >
                Login with Google
              </Button>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="underline underline-offset-4"
                >
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
