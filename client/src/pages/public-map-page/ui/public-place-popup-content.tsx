import { IPlace, PlacePhotoGallery, PlacePopupCard } from '@/entities/place';

interface PublicPlacePopupContentProps {
  place: IPlace;
}

export const PublicPlacePopupContent = ({
  place,
}: PublicPlacePopupContentProps) => {
  return (
    <PlacePopupCard place={place}>
      <PlacePhotoGallery photos={place.photos || []} />
    </PlacePopupCard>
  );
};
