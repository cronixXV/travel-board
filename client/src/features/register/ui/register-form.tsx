import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'

import { RegisterSchema, RegisterInput } from '@wanderboard/shared'

import { useRegister } from '@/entities/auth'

import { Button } from '@/shared/ui/button/ui/button'
import { Input } from '@/shared/ui/input/ui/input'
import { Label } from '@/shared/ui/label/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card/ui/card'

export const RegisterForm = () => {
  const navigate = useNavigate()
  const { mutate: register_, isPending, error } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = (data: RegisterInput) => {
    register_(data, {
      onSuccess: () => navigate('/'),
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Регистрация</CardTitle>
        <CardDescription>
          Создайте аккаунт и начните отмечать свои путешествия
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...register('username')} />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">
              Ошибка регистрации. Попробуйте другой email или username.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Регистрируем...' : 'Зарегистрироваться'}
          </Button>

          <p className="text-center text-sm text-slate-500">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="underline">
              Войти
            </Link>
          </p>

        </form>
      </CardContent>
    </Card>
  )
}