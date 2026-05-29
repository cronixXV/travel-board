import React, { useState } from 'react'
import { useCreatePlace } from '@/entities/place'

interface IAddPlaceFormProps {
  lat: number
  lng: number
  onClose: () => void
}

export const AddPlaceForm = ({ lat, lng, onClose }: IAddPlaceFormProps) => {
  const { mutate: createPlace, isPending } = useCreatePlace()
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) return

    createPlace(
      {
        name: name.trim(),
        description: description.trim(),
        lat,
        lng,
        isPublic: false,
      },
      {
        onSuccess: () => {
          setName('')
          setDescription('')
          onClose()
        },
      }
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Новое место</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-lg leading-none"
        >
          ×
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Название места"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
          autoFocus
        />
        <textarea
          placeholder="Описание (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="flex-1 px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
          >
            {isPending ? 'Сохраняем...' : 'Добавить'}
          </button>
        </div>
      </form>
    </div>
  )
}