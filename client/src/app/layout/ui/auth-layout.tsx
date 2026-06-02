import { Link } from 'react-router-dom';
import { Compass, MapPin, Route, Share2 } from 'lucide-react';

interface IAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export const AuthLayout = ({
  children,
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkTo,
}: IAuthLayoutProps) => {
  return (
    <main className="relative min-h-screen overflow-hidden wb-page">
      <div className="absolute inset-0 auth-map-bg" />

      <div className="absolute left-[8%] top-[14%] hidden items-center gap-2 rounded-full wb-panel px-4 py-2 text-sm font-medium text-slate-700 md:flex dark:text-slate-200">
        <MapPin className="h-4 w-4 text-[#ff4d3d]" />
        Мои путешествия
      </div>

      <div className="absolute left-[15%] top-[25%] hidden rounded-2xl wb-panel p-3 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl wb-brand-icon">
            <Route className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Маршруты
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Сохраняй места на карте
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-[24%] top-[40%] hidden rounded-2xl wb-panel p-3 xl:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950">
            <Share2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Делись картой
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Покажи поездки друзьям
            </p>
          </div>
        </div>
      </div>

      <section className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_480px]">
        <div className="hidden px-10 py-8 lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="flex w-fit items-center gap-2 text-slate-950 transition hover:opacity-80 dark:text-slate-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg dark:bg-slate-50 dark:text-slate-950">
              <Compass className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Wanderboard
            </span>
          </Link>

          <div className="max-w-xl pb-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full wb-panel px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className="h-2 w-2 rounded-full bg-[#ff4d3d]" />
              Персональная карта путешествий
            </div>

            <h1 className="text-5xl font-bold tracking-[-0.04em] text-slate-950 dark:text-slate-50">
              Отмечай города, сохраняй фото и собирай свою карту мира.
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
              Wanderboard помогает хранить воспоминания не списком, а прямо на
              карте — с местами, датами, описаниями и фотографиями.
            </p>
          </div>
        </div>

        <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-105">
            <div className="mb-6 flex justify-center lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-2 text-slate-950 transition hover:opacity-80 dark:text-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg dark:bg-slate-50 dark:text-slate-950">
                  <Compass className="h-5 w-5" />
                </div>

                <span className="text-xl font-bold tracking-tight">
                  Wanderboard
                </span>
              </Link>
            </div>

            <div className="rounded-[2rem] wb-card p-2">
              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 text-slate-950 sm:p-7 dark:border-white/10 dark:bg-slate-950 dark:text-slate-50">
                <div className="mb-7">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl wb-brand-icon shadow-sm">
                    <MapPin className="h-6 w-6" />
                  </div>

                  <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 dark:text-slate-50">
                    {title}
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                </div>

                {children}

                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  {footerText}{' '}
                  <Link
                    to={footerLinkTo}
                    className="font-semibold text-slate-950 underline decoration-[#ffdf3d] decoration-2 underline-offset-4 transition hover:text-black dark:text-slate-50 dark:hover:text-white"
                  >
                    {footerLinkText}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
