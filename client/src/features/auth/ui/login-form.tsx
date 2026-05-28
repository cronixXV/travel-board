import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'

import {
  LoginInput,
  LoginSchema,
} from '@wanderboard/shared';
import { useLogin } from '@/entities/auth'

import { Button } from '@/shared/ui/button/ui/button'
import { Input } from '@/shared/ui/input/ui/input'
import { Label } from '@/shared/ui/label/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card/ui/card'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => navigate('/'),
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Войти</CardTitle>
        <CardDescription>Войдите в свой аккаунт Wanderboard</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">Неверный email или пароль</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Входим...' : 'Войти'}
          </Button>

          <p className="text-center text-sm text-slate-500">
            Нет аккаунта?{' '}
            <Link to="/register" className="underline">
              Зарегистрироваться
            </Link>
          </p>

        </form>
      </CardContent>
    </Card>
  )
}