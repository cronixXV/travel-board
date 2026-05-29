import { LoginForm } from '@/features/auth'
import { AuthLayout } from '@/app/layout/ui/auth-layout.tsx';

export const LoginPage = () => {
  return (
    <AuthLayout
      title="Вход в аккаунт"
      description="Вернитесь к своей карте путешествий, сохранённым местам и фотографиям."
      footerText="Нет аккаунта?"
      footerLinkText="Создать аккаунт"
      footerLinkTo="/register"
    >
      <LoginForm />
    </AuthLayout>
  )
}