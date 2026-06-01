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
  'h-12 rounded-2xl border-slate-200 bg-slate-50 pl-12 text-base shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-[#ffdf3d] focus-visible:ring-[#ffdf3d]/40 aria-invalid:border-red-300 aria-invalid:bg-red-50/40 aria-invalid:ring-red-100';

const errorClassName =
  'flex items-center gap-1.5 text-sm font-medium text-red-500';

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
        <Label
          htmlFor="username"
          className="text-sm font-semibold text-slate-700"
        >
          Имя пользователя
        </Label>

        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
            <AlertCircle className="h-4 w-4" />
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
          Почта
        </Label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
            <AlertCircle className="h-4 w-4" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-semibold text-slate-700"
        >
          Пароль
        </Label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
            <AlertCircle className="h-4 w-4" />
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Не удалось создать аккаунт. Попробуйте другой email или username.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-2xl bg-[#ffdf3d] text-base font-bold text-slate-950 shadow-[0_12px_30px_rgba(255,223,61,0.35)] transition hover:bg-[#ffd21f] hover:shadow-[0_16px_38px_rgba(255,223,61,0.45)]"
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
