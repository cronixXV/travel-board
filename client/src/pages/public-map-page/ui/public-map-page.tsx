import { useParams } from 'react-router-dom';

import {
  PublicMap,
  PublicMapLoading,
  PublicMapNotFound,
} from '@/widgets/public-map';

import { usePublicMapQuery } from '../model/hooks/use-public-map';
import { PublicMapSeo } from './public-map-seo';

export const PublicMapPage = () => {
  const { username } = useParams<{ username: string }>();

  const { data, isLoading, isError } = usePublicMapQuery(username);

  if (isLoading) {
    return <PublicMapLoading />;
  }

  if (isError || !data) {
    return <PublicMapNotFound />;
  }

  const { user, places } = data;

  return (
    <>
      <PublicMapSeo user={user} places={places} />
      <PublicMap user={user} places={places} />
    </>
  );
};
