// App.js
import React, { useEffect, useState } from 'react';
import QRCodePrintModal from './components/QRCodePrintModal';
import ProfileEditorModal from './components/ProfileEditorModal';
import WarehouseEditor from './components/WarehouseEditor';
import PlacesEditor from './components/PlacesEditor';
import CompactPlacesGrid from './components/CompactPlacesGrid';
import ItemEditor from './components/ItemEditor';
import ItemEditModal from './components/ItemEditModal';
import ItemTypesManager from './components/ItemTypesManager';
import ItemsOnPlaceModal from './components/ItemsOnPlaceModal';
import ContactsModal from './components/ContactsModal';
import { api } from './api';

export default function App() {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [user, setUser] = useState(null);
  const [modals, setModals] = useState({});
  const [view, setView] = useState('main');

  useEffect(() => {
    const loadData = async () => {
      const [wh, it, types, usr] = await Promise.all([
        api.fetchWarehouses(),
        api.fetchItems(),
        api.fetchItemTypes(),
        api.fetchUser(),
      ]);
      setWarehouses(wh);
      setItems(it);
      setItemTypes(types);
      setUser(usr);
    };
    loadData();
  }, []);

  const openModal = (name, payload = {}) => setModals(prev => ({ ...prev, [name]: payload }));
  const closeModal = (name) => setModals(prev => ({ ...prev, [name]: null }));

  if (view === 'planning') {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Планирование маршрутов</h1>
        <button onClick={() => setView('main')} className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Назад</button>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <h2 className="text-lg font-semibold mb-2">Заявки</h2>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.id} className="p-2 border rounded bg-white shadow">
                  {item.name} ({item.quantity})
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2">
            <h2 className="text-lg font-semibold mb-2">График маршрутов</h2>
            <div className="overflow-x-auto border rounded bg-white p-4 shadow">
              <div className="relative" style={{ minWidth: '1000px' }}>
                {[...Array(15)].map((_, hour) => (
                  <div key={hour} className="absolute top-0 left-[" + (hour * 60) + "px] w-[60px] border-l border-gray-300 text-xs text-center">
                    {7 + hour}:00
                  </div>
                ))}
                <div className="mt-8 space-y-4">
                  {[...items].sort((a, b) => b.name.localeCompare(a.name)).map((item, index) => {
                    const start = Math.floor(Math.random() * 9) * 60;
                    const width = Math.max(60, Math.min(180, item.quantity * 10));
                    return (
                      <div key={item.id} className="relative h-8">
                        <div
                          className="absolute top-0 h-8 rounded bg-blue-500 text-white text-xs flex items-center justify-center cursor-move"
                          style={{ left: `${start}px`, width: `${width}px` }}
                        >
                          {item.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Складская система</h1>
      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={() => openModal('profileEditor')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Редактировать профиль</button>
        <button onClick={() => openModal('addWarehouse')} className="px-4 py-2 bg-green-600 text-white rounded">+ Склад</button>
        <button onClick={() => openModal('addItem')} className="px-4 py-2 bg-yellow-500 text-white rounded">+ Позиция</button>
        <button onClick={() => openModal('manageTypes')} className="px-4 py-2 bg-gray-600 text-white rounded">Типы</button>
        <button onClick={() => setView('planning')} className="px-4 py-2 bg-indigo-600 text-white rounded">Планирование маршрута</button>
      </div>

      {/* Модальные окна */}
      {modals.profileEditor && (
        <ProfileEditorModal user={user} onSave={setUser} onCancel={() => closeModal('profileEditor')} />
      )}
      {modals.addWarehouse && (
        <WarehouseEditor
          onSave={(data) => {
            setWarehouses(prev => [...prev, { ...data, id: crypto.randomUUID(), places: [] }]);
            closeModal('addWarehouse');
          }}
          onCancel={() => closeModal('addWarehouse')}
        />
      )}
      {modals.editPlaces && (
        <PlacesEditor
          initialPlaces={modals.editPlaces.places}
          onSave={(newPlaces) => {
            setWarehouses(prev => prev.map(w => w.id === modals.editPlaces.id ? { ...w, places: newPlaces } : w));
            closeModal('editPlaces');
          }}
          onCancel={() => closeModal('editPlaces')}
          onReset={() => {
            const reset = confirm('Сбросить все места?');
            if (reset) {
              setWarehouses(prev => prev.map(w => w.id === modals.editPlaces.id ? { ...w, places: [] } : w));
              closeModal('editPlaces');
            }
          }}
        />
      )}
      {modals.addItem && (
        <ItemEditor
          warehouses={warehouses}
          itemTypes={itemTypes}
          onSave={(newItem) => {
            setItems(prev => [...prev, newItem]);
            closeModal('addItem');
          }}
          onCancel={() => closeModal('addItem')}
          onManageTypes={() => {
            closeModal('addItem');
            openModal('manageTypes');
          }}
          items={items}
          userRole={user?.role}
        />
      )}
      {modals.editItem && (
        <ItemEditModal
          item={modals.editItem.item}
          itemTypes={itemTypes}
          onSave={(updatedItem) => {
            setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
            closeModal('editItem');
          }}
          onCancel={() => closeModal('editItem')}
        />
      )}
      {modals.manageTypes && (
        <ItemTypesManager
          types={itemTypes}
          onSave={(types) => {
            setItemTypes(types);
            closeModal('manageTypes');
          }}
          onCancel={() => closeModal('manageTypes')}
        />
      )}
      {modals.placeItems && (
        <ItemsOnPlaceModal
          items={modals.placeItems.items}
          itemTypes={itemTypes}
          onClose={() => closeModal('placeItems')}
        />
      )}
      {modals.contacts && (
        <ContactsModal
          user={modals.contacts.user}
          onClose={() => closeModal('contacts')}
        />
      )}
      {modals.qrPrint && (
        <QRCodePrintModal
          item={modals.qrPrint.item}
          onClose={() => closeModal('qrPrint')}
        />
      )}
    </div>
  );
}
