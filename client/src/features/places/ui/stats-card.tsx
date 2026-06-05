import { MapPin } from 'lucide-react';

export const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof MapPin;
}) => {
  return (
    <div className="rounded-2xl wb-muted-card px-3 py-3">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl wb-brand-icon shadow-sm">
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-lg font-black leading-none tracking-[-0.03em] text-slate-950 dark:text-slate-50">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
};
