'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormValues } from '../validations';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError('The email or password provided is incorrect.');
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setServerError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
      {serverError && (
        <div className='flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
          <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
          <span>{serverError}</span>
        </div>
      )}

      <div className='space-y-1.5'>
        <Label htmlFor='email'>Email address</Label>
        <Input
          id='email'
          type='email'
          autoComplete='email'
          placeholder='dr.smith@example.com'
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <p className='text-xs text-red-600'>{errors.email.message}</p>}
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='password'>Password</Label>
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='current-password'
            placeholder='••••••••'
            className='pr-9'
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <button
            type='button'
            className='absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </button>
        </div>
        {errors.password && <p className='text-xs text-red-600'>{errors.password.message}</p>}
      </div>

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
