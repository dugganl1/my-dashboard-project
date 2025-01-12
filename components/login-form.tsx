"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
  password: z.string().min(1, { message: "Please enter your password" }), // Simplified password validation
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsEmailLoading(true);
    try {
      console.log(values);
      // Add your login logic here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
    } finally {
      setIsEmailLoading(false);
    }
    console.log(values);
    // Add your login logic here
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      console.log("Google sign in");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
              noValidate
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
                        disabled={isEmailLoading}
                        type="email"
                        placeholder="name@company.com"
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
                          disabled={isEmailLoading}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
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
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isEmailLoading}
              >
                {isEmailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
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
                className="w-full"
                disabled={isGoogleLoading}
                onClick={handleGoogleSignIn}
              >
                {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login with Google
              </Button>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
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
