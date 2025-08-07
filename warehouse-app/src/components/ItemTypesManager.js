// components/ItemTypesManager.js
import React, { useState } from 'react';

export default function ItemTypesManager({ types, onSave, onCancel }) {
  const [typeList, setTypeList] = useState(types);

  const handleChange = (index, field, value) => {
    const updated = [...typeList];
    updated[index][field] = value;
    setTypeList(updated);
  };

  const handleAdd = () => {
    setTypeList(prev => [...prev, { id: crypto.randomUUID(), name: '', color: '#cccccc' }]);
  };

  const handleRemove = (index) => {
    setTypeList(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Типы позиций</h2>
        <div className="space-y-4">
          {typeList.map((type, index) => (
            <div key={type.id} className="flex items-center gap-2">
              <input
                type="text"
                value={type.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                placeholder="Название типа"
                className="flex-grow p-2 border rounded-lg"
              />
              <input
                type="color"
                value={type.color}
                onChange={(e) => handleChange(index, 'color', e.target.value)}
                className="w-12 h-12 p-0 border rounded-lg"
              />
              <button onClick={() => handleRemove(index)} className="text-red-600 hover:text-red-800 font-bold text-xl">×</button>
            </div>
          ))}
          <button onClick={handleAdd} className="w-full py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 font-semibold mt-4">Добавить тип</button>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
          <button onClick={() => onSave(typeList)} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить</button>
        </div>
      </div>
    </div>
  );
}
