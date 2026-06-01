export const PageSkeleton = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-[#f6f5ef]">
      <div className="absolute inset-0 auth-map-bg opacity-70" />

      <header className="absolute left-0 right-0 top-0 z-10 px-4 pt-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex justify-start">
            <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-[0_12px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

              <div className="pr-8">
                <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-2 h-3 w-20 animate-pulse rounded-full bg-slate-100" />
              </div>
            </div>
          </div>

          <div className="hidden rounded-full border border-white/80 bg-white/90 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl md:block">
            <div className="h-4 w-64 animate-pulse rounded-full bg-slate-200" />
          </div>

          <div className="flex justify-end">
            <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/90 p-2 shadow-[0_12px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="hidden h-10 w-32 animate-pulse rounded-full bg-slate-100 sm:block" />
              <div className="h-10 w-24 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-0 flex h-full items-center justify-center px-4">
        <div className="w-full max-w-105 rounded-[32px] border border-white/80 bg-white/90 p-7 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-[#ffdf3d]/80" />

          <div className="mt-8 h-8 w-56 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />

          <div className="mt-8 space-y-4">
            <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-[#ffdf3d]/70" />
          </div>
        </div>
      </main>
    </div>
  );
};
