// components/ItemsOnPlaceModal.js
import React from 'react';

export default function ItemsOnPlaceModal({ items, itemTypes, onClose }) {
  const getColor = (typeName) => itemTypes.find(t => t.name === typeName)?.color || '#ccc';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Позиции на выбранном месте</h2>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="p-3 border rounded-lg flex items-center gap-4" style={{ backgroundColor: getColor(item.type) }}>
              <span className="text-white font-semibold">{item.name}</span>
              <span className="text-white">{item.quantity} шт</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Закрыть</button>
        </div>
      </div>
    </div>
  );
}
