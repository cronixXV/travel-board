interface IStatsListProps {
  title: string;
  items: Array<{ label: string; count: number }>;
  testId?: string;
}

export const StatsList = ({ title, items, testId }: IStatsListProps) => {
  if (!items.length) {
    return null;
  }

  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <div data-testid={testId} className="rounded-2xl wb-muted-card p-3">
      <p className="mb-3 text-sm font-bold text-slate-950 dark:text-slate-50">
        {title}
      </p>

      <div className="space-y-2">
        {items.slice(0, 5).map((item) => {
          const width = Math.max((item.count / maxCount) * 100, 8);

          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                <span className="truncate text-slate-600 dark:text-slate-300">
                  {item.label}
                </span>

                <span className="shrink-0 text-slate-500 dark:text-slate-400">
                  {item.count}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-[#ffdf3d]"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
