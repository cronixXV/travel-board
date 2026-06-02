import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export const PublicMapNotFound = () => {
  return (
    <div className="flex h-screen items-center justify-center wb-page px-4">
      <div className="w-full max-w-md rounded-[28px] wb-card p-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl wb-brand-icon">
          <MapPin className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-950 dark:text-slate-50">
          Карта не найдена
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Пользователь не существует или пока не открыл публичные места.
        </p>

        <Link
          to="/register"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl wb-brand-button px-5 text-sm font-bold transition"
        >
          Создать свою карту
        </Link>
      </div>
    </div>
  );
};
