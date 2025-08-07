import React, { useState } from 'react';
import { PlusIcon, XIcon, ChevronUpIcon, ChevronDownIcon, SaveIcon, TrashIcon } from './Icons';

const RouteConfigurator = ({ initialConfig, onSave, onClose }) => {
  const [places, setPlaces] = useState(initialConfig || []);
  const [expandedPlaceId, setExpandedPlaceId] = useState(null);

  const handleAddPlace = () => {
    const newPlace = {
      id: crypto.randomUUID(),
      name: '',
      address: '',
      description: '',
      phone: '',
      employeeName: '',
      employeePosition: '',
      ordinalNumber: places.length,
      characteristic: 'Погрузка',
      connections: {},
    };
    setPlaces(prev => [...prev, newPlace]);
    setExpandedPlaceId(newPlace.id);
  };

  const handlePlaceChange = (placeId, field, value) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleConnectionChange = (sourceId, targetId, field, value) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === sourceId) {
        const updatedConnections = { ...p.connections };
        if (!updatedConnections[targetId]) {
          updatedConnections[targetId] = { connected: false, distance: '', time: '' };
        }
        updatedConnections[targetId] = { ...updatedConnections[targetId], [field]: value };
        return { ...p, connections: updatedConnections };
      }
      return p;
    }));
  };

  const handleDeletePlace = (placeId) => {
    if (window.confirm('Вы уверены, что хотите удалить это место?')) {
      setPlaces(prev => prev.filter(p => p.id !== placeId));
    }
  };

  const handleSaveConfig = () => {
    onSave(places);
    alert('Конфигурация маршрута сохранена!');
  };

  const sortedPlaces = [...places].sort((a, b) => (a.ordinalNumber || 0) - (b.ordinalNumber || 0));

  return (
    <div className="p-4 bg-gray-50 rounded-b-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Настройка маршрутов</h3>
        <button onClick={onClose} className="p-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300"><XIcon /></button>
      </div>

      <div className="space-y-4">
        {sortedPlaces.map(place => (
          <div key={place.id} className="bg-white rounded-lg shadow-sm border">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => setExpandedPlaceId(expandedPlaceId === place.id ? null : place.id)}
            >
              <h4 className="font-bold text-lg text-gray-800">{place.name || 'Новое место'}</h4>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-gray-400">#{place.ordinalNumber}</span>
                {expandedPlaceId === place.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </div>
            </div>

            {expandedPlaceId === place.id && (
              <div className="p-4 border-t animate-fade-in-up space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Название" value={place.name} onChange={e => handlePlaceChange(place.id, 'name', e.target.value)} className="w-full p-2 border rounded-md" />
                  <input type="number" placeholder="Порядковый номер" value={place.ordinalNumber} onChange={e => handlePlaceChange(place.id, 'ordinalNumber', parseInt(e.target.value) || 0)} className="w-full p-2 border rounded-md" />
                  <input type="text" placeholder="Адрес" value={place.address} onChange={e => handlePlaceChange(place.id, 'address', e.target.value)} className="w-full p-2 border rounded-md md:col-span-2" />
                  <textarea placeholder="Описание" value={place.description} onChange={e => handlePlaceChange(place.id, 'description', e.target.value)} className="w-full p-2 border rounded-md md:col-span-2" rows="2"></textarea>
                  <input type="text" placeholder="Имя сотрудника" value={place.employeeName} onChange={e => handlePlaceChange(place.id, 'employeeName', e.target.value)} className="w-full p-2 border rounded-md" />
                  <input type="text" placeholder="Должность" value={place.employeePosition} onChange={e => handlePlaceChange(place.id, 'employeePosition', e.target.value)} className="w-full p-2 border rounded-md" />
                  <input type="tel" placeholder="Номер телефона" value={place.phone} onChange={e => handlePlaceChange(place.id, 'phone', e.target.value)} className="w-full p-2 border rounded-md" />
                  <select value={place.characteristic} onChange={e => handlePlaceChange(place.id, 'characteristic', e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    <option>Погрузка</option>
                    <option>Разгрузка</option>
                    <option>Погрузка и разгрузка</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <h5 className="font-semibold mb-2">Связи с другими местами:</h5>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {places.filter(p => p.id !== place.id).map(targetPlace => {
                      const connection = place.connections?.[targetPlace.id] || { connected: false, distance: '', time: '' };
                      return (
                        <div key={targetPlace.id} className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center text-sm">
                          <span className="font-medium">{targetPlace.name}</span>
                          <button
                            onClick={() => handleConnectionChange(place.id, targetPlace.id, 'connected', !connection.connected)}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${connection.connected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                          >
                            {connection.connected ? 'Есть' : 'Нет'}
                          </button>
                          {connection.connected && (
                            <>
                              <input type="text" placeholder="Расст." value={connection.distance} onChange={e => handleConnectionChange(place.id, targetPlace.id, 'distance', e.target.value)} className="w-20 p-1 border rounded-md" />
                              <input type="text" placeholder="Время" value={connection.time} onChange={e => handleConnectionChange(place.id, targetPlace.id, 'time', e.target.value)} className="w-20 p-1 border rounded-md" />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <button onClick={() => handleDeletePlace(place.id)} className="p-2 text-red-500 hover:text-red-700"><TrashIcon /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button onClick={handleAddPlace} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2">
          <PlusIcon /> Добавить место
        </button>
        <button onClick={handleSaveConfig} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2">
          <SaveIcon /> Сохранить
        </button>
      </div>
    </div>
  );
};

export default RouteConfigurator;