// components/ContactsModal.js
import React from 'react';

export default function ContactsModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up my-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Контакты</h2>
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Имя:</span>
            <span className="text-gray-900">{user.firstName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Фамилия:</span>
            <span className="text-gray-900">{user.lastName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Телефон:</span>
            <span className="text-gray-900">{user.phone}</span>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Закрыть</button>
        </div>
      </div>
    </div>
  );
}
