import {  useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { usePlaces, useDeletePlace, IPlace } from '@/entities/place';
import { AddPlaceForm } from '@/features/places/ui/add-place-form'
import { MapClickHandler } from './map-click-handler';
import { PhotoUploader } from '@/features/photos';

type TIconDefaultWithPrivate = L.Icon.Default & {
  _getIconUrl?: () => string
}

delete (L.Icon.Default.prototype as TIconDefaultWithPrivate)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export const TravelMap = () => {
  const { data: places = [], isLoading } = usePlaces()
  const { mutate: deletePlace } = useDeletePlace()
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </div>
    )
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapClickHandler onDblClick={(lat, lng) => setPendingCoords({ lat, lng })} />

        {places.map((place: IPlace) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup minWidth={240} maxWidth={280}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">{place.name}</h3>
                    {place.country && (
                      <p className="text-xs text-slate-400">{place.country}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deletePlace(place.id)}
                    className="text-xs text-red-400 hover:text-red-600 ml-2"
                  >
                    Удалить
                  </button>
                </div>

                {place.description && (
                  <p className="text-sm text-slate-500">{place.description}</p>
                )}

                {place.visitedAt && (
                  <p className="text-xs text-slate-400">
                    📅 {new Date(place.visitedAt).toLocaleDateString('ru-RU')}
                  </p>
                )}

                <PhotoUploader placeId={place.id} photos={place.photos || []} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {pendingCoords && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4">
          <AddPlaceForm
            lat={pendingCoords.lat}
            lng={pendingCoords.lng}
            onClose={() => setPendingCoords(null)}
          />
        </div>
      )}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-slate-600 shadow-sm">
        Двойной клик по карте — добавить место
      </div>
    </div>
  )
}