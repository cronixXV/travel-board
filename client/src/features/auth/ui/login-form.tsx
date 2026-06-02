import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { LoginInput, LoginSchema } from '@wanderboard/shared';

import { useLogin } from '@/entities/auth';

import { Button } from '@/shared/ui/button/ui/button';
import { Input } from '@/shared/ui/input/ui/input';
import { Label } from '@/shared/ui/label/ui/label';

const inputClassName =
  'h-12 rounded-2xl wb-input pl-12 text-base shadow-none transition-colors focus-visible:border-[#ffdf3d] focus-visible:ring-[#ffdf3d]/40 aria-invalid:border-red-300 aria-invalid:bg-red-50/40 aria-invalid:ring-red-100 dark:aria-invalid:border-red-400/60 dark:aria-invalid:bg-red-950/20 dark:aria-invalid:ring-red-500/20';

const labelClassName =
  'text-sm font-semibold text-slate-700 dark:text-slate-200';

const iconClassName =
  'pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500';

const errorTextClassName =
  'flex items-center gap-1.5 text-sm font-medium text-red-500 dark:text-red-400';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => navigate('/'),
    });
  };

  const hasServerError = Boolean(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className={labelClassName}>
          Почта
        </Label>

        <div className="relative">
          <Mail className={iconClassName} />

          <Input
            id="email"
            type="email"
            placeholder="Введите вашу почту"
            autoComplete="email"
            aria-invalid={Boolean(errors.email) || hasServerError}
            className={inputClassName}
            {...register('email')}
          />
        </div>

        {errors.email && (
          <p className={errorTextClassName}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className={labelClassName}>
          Пароль
        </Label>

        <div className="relative">
          <LockKeyhole className={iconClassName} />

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password) || hasServerError}
            className={inputClassName}
            {...register('password')}
          />
        </div>

        {errors.password && (
          <p className={errorTextClassName}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Неверный email или пароль. Проверьте данные и попробуйте снова.</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-2xl wb-brand-button text-base font-bold transition disabled:opacity-60"
      >
        {isPending ? (
          'Входим...'
        ) : (
          <span className="flex items-center gap-2">
            Войти
            <ArrowRight className="h-5 w-5" />
          </span>
        )}
      </Button>
    </form>
  );
};
