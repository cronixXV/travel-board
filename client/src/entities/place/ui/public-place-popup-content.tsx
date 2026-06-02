import { IPlace, PlacePhotoGallery, PlacePopupCard } from '@/entities/place';

interface IPublicPlacePopupContentProps {
  place: IPlace;
}

export const PublicPlacePopupContent = ({
  place,
}: IPublicPlacePopupContentProps) => {
  return (
    <PlacePopupCard place={place}>
      <PlacePhotoGallery photos={place.photos || []} />
    </PlacePopupCard>
  );
};
