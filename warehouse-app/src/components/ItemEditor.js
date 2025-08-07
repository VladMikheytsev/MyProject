// components/ItemEditor.js
import React, { useState, useEffect } from 'react';
import CompactPlacesGrid from './CompactPlacesGrid';
import { EditIcon } from '../icons';

export default function ItemEditor({ warehouses, itemTypes, onSave, onCancel, onManageTypes, items, userRole }) {
  const [newItem, setNewItem] = useState({ name: '', type: itemTypes[0]?.name || '', size: 'Паллета', quantity: 1, warehouseId: warehouses[0]?.id || null, placeId: null });
  const [disabledPlaces, setDisabledPlaces] = useState([]);

  useEffect(() => {
    if (!newItem.warehouseId && warehouses.length > 0) {
      setNewItem(prev => ({ ...prev, warehouseId: warehouses[0].id }));
    }
  }, [warehouses, newItem.warehouseId]);

  useEffect(() => {
    if (newItem.warehouseId && newItem.size) {
      const selectedWarehouse = warehouses.find(w => w.id === newItem.warehouseId);
      if (!selectedWarehouse) return;
      const newDisabled = [];
      (selectedWarehouse.places || []).forEach(place => {
        const itemsHere = items.filter(i => i.placeId === place.id && i.warehouseId === newItem.warehouseId);
        if (newItem.size === 'Паллета') {
          if (place.type === 'shelving') newDisabled.push(place.id);
          if (place.type === 'pallet' && itemsHere.filter(i => i.size === 'Паллета').length >= 2) newDisabled.push(place.id);
        }
      });
      setDisabledPlaces(newDisabled);
    }
  }, [newItem.warehouseId, newItem.size, warehouses, items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value, placeId: name === 'warehouseId' ? null : prev.placeId }));
  };

  const handleSave = () => {
    if (!newItem.name || !newItem.type || !newItem.size || !newItem.quantity || !newItem.warehouseId || newItem.placeId === null) {
      alert('Пожалуйста, заполните все поля и выберите место.');
      return;
    }
    onSave({ ...newItem, id: crypto.randomUUID() });
  };

  const selectedWarehouse = warehouses.find(w => w.id === newItem.warehouseId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Создать позицию</h2>
        <div className="space-y-4">
          <input type="text" name="name" value={newItem.name} onChange={handleChange} placeholder="Наименование" className="w-full p-3 border rounded-lg" />

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Тип позиции:</label>
              {userRole === 'Администратор' && (
                <button onClick={onManageTypes} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"><EditIcon /></button>
              )}
            </div>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {itemTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setNewItem(prev => ({ ...prev, type: t.name }))}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${newItem.type === t.name ? 'ring-2 ring-offset-1' : ''}`}
                  style={{ backgroundColor: newItem.type === t.name ? t.color : '#e5e7eb', color: newItem.type === t.name ? 'white' : '#374151', borderColor: t.color }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'white', opacity: newItem.type === t.name ? 1 : 0.5 }}></div>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select name="size" value={newItem.size} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option>Паллета</option>
              <option>Коробка</option>
              <option>Шт</option>
            </select>
            <input type="number" name="quantity" value={newItem.quantity} onChange={handleChange} placeholder="Количество" min="1" className="w-full p-3 border rounded-lg" />
          </div>

          <select name="warehouseId" value={newItem.warehouseId || ''} onChange={handleChange} className="w-full p-3 border rounded-lg">
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>

          {selectedWarehouse && (
            <div>
              <h3 className="font-semibold mb-2">Выберите место на складе "{selectedWarehouse.name}"</h3>
              <div className="max-h-64 overflow-auto p-2 bg-gray-100 rounded-lg">
                <CompactPlacesGrid
                  places={selectedWarehouse.places || []}
                  onPlaceSelect={(placeInfo) => setNewItem(prev => ({ ...prev, placeId: placeInfo.placeId }))}
                  selectedPlaceInfo={newItem}
                  disabledPlaces={disabledPlaces}
                  items={items.filter(i => i.warehouseId === selectedWarehouse.id)}
                  itemTypes={itemTypes}
                  warehouseId={selectedWarehouse.id}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить позицию</button>
        </div>
      </div>
    </div>
  );
}
