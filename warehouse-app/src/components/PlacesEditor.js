// components/PlacesEditor.js
import React, { useState } from 'react';
import { SaveIcon, ResetIcon, XIcon } from '../icons';
import PalletLines from './PalletLines';
import ShelvingLines from './ShelvingLines';

export default function PlacesEditor({ initialPlaces, onSave, onCancel, onReset }) {
  const [placeStates, setPlaceStates] = useState(() => {
    const states = Array(49).fill(0);
    initialPlaces.forEach(p => {
      if (p.type === 'pallet') states[p.id] = p.orientation === '30*36' ? 1 : 2;
      else if (p.type === 'shelving') states[p.id] = p.orientation === '40*15' ? 3 : 4;
    });
    return states;
  });

  const handleButtonClick = (id) => {
    setPlaceStates(prev => {
      const newStates = [...prev];
      newStates[id] = (newStates[id] + 1) % 5;
      return newStates;
    });
  };

  const handleSave = () => {
    const selectedPlaces = [];
    placeStates.forEach((state, id) => {
      if (state === 1) selectedPlaces.push({ id, type: 'pallet', orientation: '30*36' });
      else if (state === 2) selectedPlaces.push({ id, type: 'pallet', orientation: '36*30' });
      else if (state === 3) selectedPlaces.push({ id, type: 'shelving', orientation: '40*15' });
      else if (state === 4) selectedPlaces.push({ id, type: 'shelving', orientation: '15*40' });
    });
    onSave(selectedPlaces);
  };

  const getButtonStyle = (state) => {
    let style = { width: '30px', height: '36px', backgroundColor: '#d1d5db', position: 'relative', overflow: 'hidden' };
    let className = 'flex-shrink-0';
    switch (state) {
      case 1: style.backgroundColor = 'rgb(245, 192, 93)'; break;
      case 2: style = { ...style, width: '36px', height: '30px', backgroundColor: 'rgb(245, 192, 93)' }; break;
      case 3: style = { ...style, width: '40px', height: '15px', backgroundColor: 'rgb(84, 73, 61)' }; break;
      case 4: style = { ...style, width: '15px', height: '40px', backgroundColor: 'rgb(84, 73, 61)' }; break;
    }
    return { style, className };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Редактирование мест</h2>
        <div style={{ borderTop: '5px solid black', borderLeft: '5px solid black', borderRight: '5px solid black', padding: '4px', width: 'fit-content', margin: '0 auto' }}>
          <div className="grid grid-cols-7 justify-center" style={{ gap: '3px' }}>
            {placeStates.map((state, id) => {
              const { className, style } = getButtonStyle(state);
              return (
                <div key={id} className="flex items-center justify-center" style={{ width: '45px', height: '45px' }}>
                  <button onClick={() => handleButtonClick(id)} className={className} style={style}>
                    {(state === 1 || state === 2) && <PalletLines orientation={state === 1 ? 'vertical' : 'horizontal'} />}
                    {(state === 3 || state === 4) && <ShelvingLines orientation={state === 4 ? 'vertical' : 'horizontal'} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center items-center gap-x-6 mt-8 w-full">
          <button onClick={onCancel} className="w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 shadow-md"><XIcon /></button>
          <button onClick={onReset} className="w-16 h-16 rounded-full text-white bg-yellow-500 hover:bg-yellow-600 shadow-md"><ResetIcon /></button>
          <button onClick={handleSave} className="w-16 h-16 rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-md"><SaveIcon /></button>
        </div>
      </div>
    </div>
  );
}
