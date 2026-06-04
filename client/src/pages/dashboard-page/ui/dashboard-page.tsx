import { useMemo, useState } from 'react';
import { useDebounceValue } from '@siberiacancode/reactuse';

import { TPlaceVisibilityFilter, usePlacesWithMeta } from '@/entities/place';
import { PlacesSearchButton } from '@/features/places';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { TravelMap } from '@/widgets/travel-map';

export const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState<TPlaceVisibilityFilter>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const debouncedSearch = useDebounceValue(search, 700);

  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      visibility,
    }),
    [debouncedSearch, visibility]
  );

  const { data, isLoading, isFetching } = usePlacesWithMeta(filters);

  const places = data?.places || [];
  const totalCount = data?.meta?.total ?? places.length;
  const filteredCount = data?.meta?.filtered ?? places.length;

  const handleResetFilters = () => {
    setSearch('');
    setVisibility('all');
  };

  return (
    <DashboardLayout
      afterUserSlot={
        <PlacesSearchButton
          search={search}
          visibility={visibility}
          isOpen={isSearchOpen}
          totalCount={totalCount}
          filteredCount={filteredCount}
          onOpenChange={setIsSearchOpen}
          onSearchChange={setSearch}
          onVisibilityChange={setVisibility}
          onReset={handleResetFilters}
        />
      }
    >
      <TravelMap
        places={places}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </DashboardLayout>
  );
};
