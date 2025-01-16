'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, GalleryVerticalEnd } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { signup } from '@/app/auth/actions';
import { signInWithGoogle } from '@/app/auth/actions';

const formSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: '' })
    .refine(
      (name) => {
        const words = name.trim().split(/\s+/);
        return words.length >= 2;
      },
      { message: 'Please enter both your first and last name' }
    ),
  email: z
    .string()
    .min(1, { message: '' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: '' })
    .refine(
      (password) => {
        return (
          password.length >= 8 &&
          /[A-Z]/.test(password) &&
          /[0-9]/.test(password) &&
          /[^A-Za-z0-9]/.test(password)
        );
      },
      { message: '' }
    ),
});

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsEmailLoading(true);
    try {
      console.log('Form submission:', values);

      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('fullName', values.fullName);

      await signup(formData);
    } finally {
      setIsEmailLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Note: we don't need to handle the redirect here as the signInWithGoogle
      // function will handle that for us
    } catch (error) {
      console.error('Google sign up error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left Panel - Dark with Quote */}
          <div className="relative hidden bg-zinc-950 md:block">
            <div className="relative z-20 flex h-full flex-col p-6 md:p-8">
              <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                  <p className="text-md text-white">
                    &ldquo;This library has saved me countless hours of work and
                    helped me deliver stunning designs to my clients faster than
                    ever before.&rdquo;
                  </p>
                  <footer className="text-sm text-white/60">Sofia Davis</footer>
                </blockquote>
              </div>
            </div>
          </div>

          {/* Right Panel - Sign Up Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8"
              noValidate
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome to Acme!
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your details below to create an account
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="fullName">Full name</Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Full name"
                          autoCapitalize="words"
                          autoComplete="name"
                          autoCorrect="off"
                          disabled={isEmailLoading}
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
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isEmailLoading}
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
                      <Label htmlFor="password">Password</Label>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            disabled={isEmailLoading}
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
                      {(isPasswordFocused || field.value.length > 0) && (
                        <ul className="text-sm mt-2 space-y-1">
                          <li
                            className={
                              field.value.length >= 8
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >
                            • At least 8 characters
                          </li>
                          <li
                            className={
                              /[A-Z]/.test(field.value)
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >
                            • One uppercase letter
                          </li>
                          <li
                            className={
                              /[0-9]/.test(field.value)
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >
                            • One number
                          </li>
                          <li
                            className={
                              /[^A-Za-z0-9]/.test(field.value)
                                ? 'text-green-500'
                                : 'text-red-500'
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
                  disabled={isEmailLoading}
                >
                  {isEmailLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create account
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={handleGoogleSignUp}
                  className="w-full"
                >
                  {isGoogleLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign up with Google
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{' '}
        <Link href="/terms">Terms of Service</Link> and{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
