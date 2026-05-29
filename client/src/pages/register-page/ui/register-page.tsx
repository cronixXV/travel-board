import { RegisterForm } from '@/features/register'
import { AuthLayout } from '@/app/layout/ui/auth-layout.tsx';

export const RegisterPage = () => {
  return (
    <AuthLayout
      title="Создать аккаунт"
      description="Начните собирать личную карту путешествий с городами, датами и фото."
      footerText="Уже есть аккаунт?"
      footerLinkText="Войти"
      footerLinkTo="/login"
    >
      <RegisterForm />
    </AuthLayout>
  )
}