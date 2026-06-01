import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ProtectedRoute } from '@/app/router/protected-route';
import { PageSkeleton } from '@/shared/ui/page-skeleton/ui/page-skeleton.tsx';

const LoginPage = lazy(() =>
  import('@/pages/login-page/ui/login-page').then((module) => ({
    default: module.LoginPage,
  }))
);

const RegisterPage = lazy(() =>
  import('@/pages/register-page/ui/register-page').then((module) => ({
    default: module.RegisterPage,
  }))
);

const DashboardPage = lazy(() =>
  import('@/pages/dashboard-page/ui/dashboard-page').then((module) => ({
    default: module.DashboardPage,
  }))
);

const PublicMapPage = lazy(() =>
  import('@/pages/public-map-page/ui/public-map-page').then((module) => ({
    default: module.PublicMapPage,
  }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/map/:username" element={<PublicMapPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
