import { IPlace, IPublicMapUser } from '@/entities/place';

import { getPublicMapMeta } from '../lib/get-public-map-meta';

type TPublicMapSeoProps = {
  user: IPublicMapUser;
  places: IPlace[];
};

export const PublicMapSeo = ({ user, places }: TPublicMapSeoProps) => {
  const { title, description, pageUrl, ogImage } = getPublicMapMeta({
    user,
    places,
  });

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
};
