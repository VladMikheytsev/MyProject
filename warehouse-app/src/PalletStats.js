import React from 'react';

const PalletStats = ({ places = [], items = [] }) => {
  const palletPlaces = places.filter(p => p.type === 'pallet');
  const totalPalletPlaces = palletPlaces.length;

  if (totalPalletPlaces === 0) {
    return <p className="mt-2 text-sm text-center text-gray-500">Паллетные места не сконфигурированы</p>;
  }

  const palletPlaceIds = new Set(palletPlaces.map(p => p.id));

  const occupiedPalletPlaceIds = new Set();
  items.forEach(item => {
    if (palletPlaceIds.has(item.placeId)) {
      occupiedPalletPlaceIds.add(item.placeId);
    }
  });

  const occupiedPalletPlacesCount = occupiedPalletPlaceIds.size;
  const freePalletPlacesCount = totalPalletPlaces - occupiedPalletPlacesCount;

  return (
    <div className="mt-2 text-sm text-gray-600 space-y-1">
      <div className="flex justify-between">
        <span>Всего паллетных мест:</span>
        <span className="font-semibold text