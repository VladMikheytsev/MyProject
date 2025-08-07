// components/ProfileEditorModal.js
import React, { useState } from 'react';
import { LogOutIcon } from '../icons';

export default function ProfileEditorModal({ user, warehouses, onSave, onClose, onLogout }) {
  const [userData, setUserData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Редактировать профиль</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} placeholder="Имя" className="w-full p-3 border rounded-lg" />
            <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Фамилия" className="w-full p-3 border rounded-lg" />
          </div>
          <input type="text" name="position" value={userData.position} onChange={handleChange} placeholder="Должность" className="w-full p-3 border rounded-lg" />
          <input type="tel" name="phone" value={userData.phone} onChange={handleChange} placeholder="Телефон" className="w-full p-3 border rounded-lg" />
          <select name="assignedWarehouseId" value={userData.assignedWarehouseId} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
            <option value="office">Офис (не привязан к складу)</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center mt-8">
          <button onClick={onLogout} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 font-semibold transition">
            <LogOutIcon /> <span>Выйти</span>
          </button>
          <div className="flex space-x-4">
            <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
            <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  );
}
