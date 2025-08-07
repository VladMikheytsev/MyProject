// components/CompactPlacesGrid.js
import React from 'react';
import PalletLines from './PalletLines';
import ShelvingLines from './ShelvingLines';

export default function CompactPlacesGrid({ places, items = [], onPlaceSelect, selectedPlaceInfo, disabledPlaces = [], itemTypes, warehouseId }) {
  const activeRows = new Set();
  const activeCols = new Set();
  places.forEach(p => {
    activeRows.add(Math.floor(p.id / 7));
    activeCols.add(p.id % 7);
  });
  const sortedRows = [...activeRows].sort((a, b) => a - b);
  const sortedCols = [...activeCols].sort((a, b) => a - b);

  return (
    <div className="flex flex-col p-1" style={{ width: 'fit-content', backgroundColor: '#f9fafb', borderTop: '3px solid black', borderLeft: '3px solid black', borderRight: '3px solid black' }}>
      {sortedRows.map(row => (
        <div key={row} className="flex">
          {sortedCols.map(col => {
            const id = row * 7 + col;
            const place = places.find(p => p.id === id);
            let style = { width: '20px', height: '24px', position: 'relative', overflow: 'hidden' };
            let backgroundColor = 'transparent';
            let isDisabled = disabledPlaces.includes(id);
            let isSelected = selectedPlaceInfo?.placeId === id && selectedPlaceInfo?.warehouseId === warehouseId;
            let itemsHere = items.filter(item => item.placeId === id);

            if (place) {
              if (place.type === 'pallet') {
                backgroundColor = 'rgb(245, 192, 93)';
                style.width = place.orientation === '30*36' ? '20px' : '24px';
                style.height = place.orientation === '30*36' ? '24px' : '20px';
              } else if (place.type === 'shelving') {
                backgroundColor = 'rgb(84, 73, 61)';
                style.width = place.orientation === '40*15' ? '27px' : '10px';
                style.height = place.orientation === '40*15' ? '10px' : '27px';
              }
            }

            return (
              <div key={col} className="flex items-center justify-center" style={{ width: '30px', height: '30px', margin: '1.5px' }}>
                <div
                  onClick={() => onPlaceSelect && !isDisabled && onPlaceSelect({ placeId: id, warehouseId })}
                  className={`rounded-sm flex items-center justify-center gap-1 ${onPlaceSelect ? 'cursor-pointer' : ''} ${isDisabled ? 'opacity-30' : ''} ${isSelected ? 'ring-2 ring-offset-1 ring-red-500' : ''}`}
                  style={{ ...style, backgroundColor }}
                >
                  {place && place.type === 'pallet' && itemsHere.length === 0 && (
                    <PalletLines orientation={place.orientation === '30*36' ? 'vertical' : 'horizontal'} />
                  )}
                  {place && place.type === 'shelving' && (
                    <ShelvingLines orientation={place.orientation === '15*40' ? 'vertical' : 'horizontal'} />
                  )}
                  {place && place.type === 'pallet' && itemsHere.map(item => {
                    const itemType = itemTypes.find(it => it.name === item.type);
                    return (
                      <div
                        key={item.id}
                        style={{ width: '16px', height: '16px', backgroundColor: itemType?.color || '#ccc', flexShrink: 0 }}
                        className="rounded-sm"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
