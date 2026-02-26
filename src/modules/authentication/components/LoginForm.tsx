'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { APP_ROUTES } from '@/lib/routes/app-routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { loginSchema, type LoginFormValues } from '../validations';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? APP_ROUTES.dashboard;

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error((result as { code?: string }).code ?? 'Sign in failed. Please try again.');
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
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
            className='absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-600'
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
