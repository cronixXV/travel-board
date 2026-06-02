import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, LockKeyhole, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { RegisterInput, RegisterSchema } from '@wanderboard/shared';

import { useRegister } from '@/entities/auth';

import { Button } from '@/shared/ui/button/ui/button';
import { Input } from '@/shared/ui/input/ui/input';
import { Label } from '@/shared/ui/label/ui/label';

const inputClassName =
  'h-12 rounded-2xl wb-input pl-12 text-base shadow-none transition-colors focus-visible:border-[#ffdf3d] focus-visible:ring-[#ffdf3d]/40 aria-invalid:border-red-300 aria-invalid:bg-red-50/40 aria-invalid:ring-red-100 dark:aria-invalid:border-red-400/60 dark:aria-invalid:bg-red-950/20 dark:aria-invalid:ring-red-500/20';

const labelClassName =
  'text-sm font-semibold text-slate-700 dark:text-slate-200';

const iconClassName =
  'pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500';

const errorClassName =
  'flex items-center gap-1.5 text-sm font-medium text-red-500 dark:text-red-400';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { mutate: register_, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    register_(data, {
      onSuccess: () => navigate('/'),
    });
  };

  const hasServerError = Boolean(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username" className={labelClassName}>
          Имя пользователя
        </Label>

        <div className="relative">
          <User className={iconClassName} />

          <Input
            id="username"
            placeholder="Введите имя пользователя"
            autoComplete="username"
            aria-invalid={Boolean(errors.username) || hasServerError}
            className={inputClassName}
            {...register('username')}
          />
        </div>

        {errors.username && (
          <p className={errorClassName}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.username.message}
          </p>
        )}
      </div>

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
          <p className={errorClassName}>
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
            placeholder="Минимум 8 символов"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            className={inputClassName}
            {...register('password')}
          />
        </div>

        {errors.password && (
          <p className={errorClassName}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Не удалось создать аккаунт. Попробуйте другой email или username.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-2xl wb-brand-button text-base font-bold transition disabled:opacity-60"
      >
        {isPending ? (
          'Создаём аккаунт...'
        ) : (
          <span className="flex items-center gap-2">
            Зарегистрироваться
            <ArrowRight className="h-5 w-5" />
          </span>
        )}
      </Button>
    </form>
  );
};
