import { ReactNode } from 'react'
import { useCurrentUser, useLogout } from '@/entities/auth'
import { Button } from '@/shared/ui/button/ui/button'

interface IDashboardLayoutProps  {
  children: ReactNode
}

export const DashboardLayout = ({ children }: IDashboardLayoutProps) => {
  const { data: user } = useCurrentUser()
  const { mutate: logout } = useLogout()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">🗺 Wanderboard</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            @{user?.username}
          </span>

          <Button variant="outline" size="sm" onClick={() => logout()}>
            Выйти
          </Button>
        </div>
      </header>

      <main style={{ height: 'calc(100vh - 64px)' }}>
        {children}
      </main>
    </div>
  )
}