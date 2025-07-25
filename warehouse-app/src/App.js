import React, { useState, useEffect, useRef } from 'react';

// --- Иконки (SVG) ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ContactsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect x="3" y="4" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" y1="2" x2="8" y2="4"/><line x1="16" y1="2" x2="16" y2="4"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ScenariosIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const FilePlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

// --- API Configuration ---
const API_BASE_URL = "https://warehouse-vlad.ngrok.io"; 

const api = {
  async request(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };
    const options = {
      method,
      headers,
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Сетевой ответ был не в порядке');
      }
      return await response.json();
    } catch (error) {
      console.error(`Ошибка при запросе к ${endpoint}:`, error);
      throw error;
    }
  },

  fetchAppData: () => api.request('/data'),
  saveAppData: (data) => api.request('/data', 'POST', data),
  fetchUsers: () => api.request('/users'),
  loginUser: (credentials) => api.request('/login', 'POST', credentials),
  registerUser: (userData) => api.request('/register', 'POST', userData),
  updateUser: (userData) => api.request(`/users/${userData.id}`, 'PUT', userData),
  deleteUser: (userId) => api.request(`/users/${userId}`, 'DELETE'),
};

// --- Компоненты дизайна паллет и стеллажей ---
const PalletLines = ({ orientation = 'vertical' }) => {
    const longLineStyle = { position: 'absolute', backgroundColor: 'rgb(255, 249, 230)' };
    const transLineStyle = { position: 'absolute', backgroundColor: 'rgb(245, 191, 93)' };
    if (orientation === 'vertical') {
        const long1 = { ...longLineStyle, width: '3px', height: '100%', left: '4px', top: '0' };
        const long2 = { ...longLineStyle, width: '3px', height: '100%', left: '10px', top: '0' };
        const long3 = { ...longLineStyle, width: '3px', height: '100%', left: '16px', top: '0' };
        const long4 = { ...longLineStyle, width: '3px', height: '100%', left: '22px', top: '0' };
        const trans1 = { ...transLineStyle, height: '5px', width: '100%', top: '0', left: '0' };
        const trans2 = { ...transLineStyle, height: '5px', width: '100%', top: '50%', left: '0', transform: 'translateY(-50%)' };
        const trans3 = { ...transLineStyle, height: '5px', width: '100%', bottom: '0', left: '0' };
        return <><div style={long1}></div><div style={long2}></div><div style={long3}></div><div style={long4}></div><div style={trans1}></div><div style={trans2}></div><div style={trans3}></div></>;
    } else {
        const long1 = { ...longLineStyle, height: '3px', width: '100%', top: '4px', left: '0' };
        const long2 = { ...longLineStyle, height: '3px', width: '100%', top: '10px', left: '0' };
        const long3 = { ...longLineStyle, height: '3px', width: '100%', top: '16px', left: '0' };
        const long4 = { ...longLineStyle, height: '3px', width: '100%', top: '22px', left: '0' };
        const trans1 = { ...transLineStyle, width: '5px', height: '100%', left: '0', top: '0' };
        const trans2 = { ...transLineStyle, width: '5px', height: '100%', left: '50%', top: '0', transform: 'translateX(-50%)' };
        const trans3 = { ...transLineStyle, width: '5px', height: '100%', right: '0', top: '0' };
        return <><div style={long1}></div><div style={long2}></div><div style={long3}></div><div style={long4}></div><div style={trans1}></div><div style={trans2}></div><div style={trans3}></div></>;
    }
};
const ShelvingLines = ({ orientation = 'vertical' }) => {
    const lineStyle = { position: 'absolute', backgroundColor: 'rgb(20, 18, 16)' };
    if (orientation === 'vertical') {
        const style1 = { ...lineStyle, height: '3px', width: '100%', top: '0', left: '0' };
        const style2 = { ...lineStyle, height: '3px', width: '100%', bottom: '0', left: '0' };
        return <><div style={style1}></div><div style={style2}></div></>;
    } else {
        const style1 = { ...lineStyle, width: '3px', height: '100%', left: '0', top: '0' };
        const style2 = { ...lineStyle, width: '3px', height: '100%', right: '0', top: '0' };
        return <><div style={style1}></div><div style={style2}></div></>;
    }
};

// --- Компонент статистики паллет ---
const PalletStats = ({ places = [], items = [] }) => {
    const palletPlaces = places.filter(p => p.type === 'pallet');
    const totalPalletPlaces = palletPlaces.length;

    if (totalPalletPlaces === 0) {
        return <p className="mt-4 pt-4 border-t text-sm text-center text-gray-500">Паллетные места не сконфигурированы</p>;
    }
    
    const palletPlaceIds = new Set(palletPlaces.map(p => p.id));

    const occupiedPalletPlaceIds = new Set();
    items.forEach(item => {
        if (palletPlaceIds.has(item.placeId)) {
            occupiedPalletPlaceIds.add(item.placeId);
        }
    });

    const occupiedPalletPlacesCount = occupiedPalletPlaceIds.size;
    const freePalletPlacesCount = totalPalletPlaces - occupiedPalletPlaceIds.size;

    return (
        <div className="mt-4 pt-4 border-t text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
                <span>Всего паллетных мест:</span>
                <span className="font-semibold text-gray-800">{totalPalletPlaces}</span>
            </div>
            <div className="flex justify-between">
                <span>Свободных мест:</span>
                <span className="font-semibold text-green-600">{freePalletPlacesCount}</span>
            </div>
        </div>
    );
};

// --- Модальные окна ---
const WarehouseEditor = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', address: '', hours: '', gate_code: '', lock_code: '', ...initialData });
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSave = () => { if (!formData.name || !formData.address) { alert('Наименование и адрес склада обязательны для заполнения.'); return; } onSave(formData); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Данные о складе</h2>
        <div className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Наименование склада" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Адрес склада" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="text" name="hours" value={formData.hours} onChange={handleChange} placeholder="Часы работы склада" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="text" name="gate_code" value={formData.gate_code} onChange={handleChange} placeholder="Код ворот" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="text" name="lock_code" value={formData.lock_code} onChange={handleChange} placeholder="Код замка" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить</button>
        </div>
      </div>
    </div>
  );
};
const WarehouseListModal = ({ warehouses, selectedId, onSelect, onEdit, onAdd, onDelete, onClose, userRole }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Выберите склад</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                    <div onClick={() => onSelect(null)} className={`p-3 rounded-lg cursor-pointer transition ${selectedId === null ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-50 hover:bg-gray-200'}`}>
                        <span className={`font-semibold ${selectedId === null ? 'text-blue-800' : 'text-gray-800'}`}>Посмотреть все склады</span>
                    </div>
                    {warehouses.map(w => (
                        <div key={w.id} onClick={() => onSelect(w.id)} className={`p-3 rounded-lg cursor-pointer transition flex justify-between items-center ${selectedId === w.id ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-50 hover:bg-gray-200'}`}>
                            <span className={`font-semibold ${selectedId === w.id ? 'text-blue-800' : 'text-gray-800'}`}>{w.name}</span>
                            {userRole === 'Администратор' && (<button onClick={(e) => { e.stopPropagation(); onEdit(w); }} className="text-gray-500 hover:text-blue-600 p-1"><EditIcon /></button>)}
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-200 pt-2 space-y-2">
                    {userRole === 'Администратор' && (<button onClick={onAdd} className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 transition py-3"><PlusIcon /><span className="ml-2 font-semibold">Добавить новый склад</span></button>)}
                    
                    {userRole === 'Администратор' && selectedId !== null && (
                        <button onClick={() => onDelete(selectedId)} className="w-full flex items-center justify-center text-red-600 hover:text-red-800 transition py-3">
                            <TrashIcon />
                            <span className="ml-2 font-semibold">Удалить выбранный склад</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
const PlacesEditor = ({ initialPlaces, onSave, onCancel, onReset }) => {
    const [placeStates, setPlaceStates] = useState(() => {
        const states = Array(49).fill(0);
        initialPlaces.forEach(p => {
            if (p.type === 'pallet') states[p.id] = p.orientation === '30*36' ? 1 : 2;
            else if (p.type === 'shelving') states[p.id] = p.orientation === '40*15' ? 3 : 4;
        });
        return states;
    });
    const handleButtonClick = (id) => { setPlaceStates(prev => { const newStates = [...prev]; newStates[id] = (newStates[id] + 1) % 5; return newStates; }); };
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
        let className = 'flex-shrink-0 transition-all duration-200 ease-in-out';
        switch (state) {
            case 1: style.backgroundColor = 'rgb(245, 192, 93)'; break;
            case 2: style.backgroundColor = 'rgb(245, 192, 93)'; style.width = '36px'; style.height = '30px'; break;
            case 3: style.backgroundColor = 'rgb(84, 73, 61)'; style.width = '40px'; style.height = '15px'; break;
            case 4: style.backgroundColor = 'rgb(84, 73, 61)'; style.width = '15px'; style.height = '40px'; break;
            default: break;
        }
        return { className, style };
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Редактирование мест</h2>
                <div style={{ borderTop: '5px solid black', borderLeft: '5px solid black', borderRight: '5px solid black', padding: '4px', width: 'fit-content', margin: '0 auto' }}>
                    <div className="grid grid-cols-7 gap-1 justify-center">
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
                    <button 
                        onClick={onCancel} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        aria-label="Отмена"
                    >
                        <XIcon />
                    </button>
                    <button 
                        onClick={onReset} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-yellow-500 hover:bg-yellow-600 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                        aria-label="Сброс"
                    >
                        <ResetIcon />
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-blue-600 hover:bg-blue-700 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label="Сохранить"
                    >
                        <SaveIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};
const CompactPlacesGrid = ({ places, items = [], onPlaceSelect, selectedPlaceInfo, disabledPlaces = [], itemTypes, warehouseId }) => {
    const activeRows = new Set();
    const activeCols = new Set();
    places.forEach(p => { activeRows.add(Math.floor(p.id / 7)); activeCols.add(p.id % 7); });
    const sortedActiveRows = Array.from(activeRows).sort((a, b) => a - b);
    const sortedActiveCols = Array.from(activeCols).sort((a, b) => a - b);

    return (
        <div className="flex flex-col gap-1 p-2" style={{ width: 'fit-content', backgroundColor: '#f9fafb', borderTop: '5px solid black', borderLeft: '5px solid black', borderRight: '5px solid black' }}>
            {sortedActiveRows.map(row => (
                <div key={row} className="flex gap-1">
                    {sortedActiveCols.map(col => {
                        const id = row * 7 + col;
                        const place = places.find(p => p.id === id);
                        let style = { width: '30px', height: '36px', position: 'relative', overflow: 'hidden' };
                        let backgroundColor = 'transparent';
                        let isDisabled = disabledPlaces.includes(id);
                        let isSelected = selectedPlaceInfo?.placeId === id && selectedPlaceInfo?.warehouseId === warehouseId;
                        let itemsOnThisPlace = [];
                        let isClickable = false;

                        if (place) {
                            itemsOnThisPlace = items.filter(item => item.placeId === id);
                            isClickable = onPlaceSelect && !isDisabled;
                            if (onPlaceSelect) {
                            } else {
                                isClickable = itemsOnThisPlace.length > 0;
                            }

                            if (place.type === 'pallet') {
                                backgroundColor = 'rgb(245, 192, 93)';
                                style.width = place.orientation === '30*36' ? '30px' : '36px';
                                style.height = place.orientation === '30*36' ? '36px' : '30px';
                            } else if (place.type === 'shelving') {
                                backgroundColor = 'rgb(84, 73, 61)';
                                style.width = place.orientation === '40*15' ? '40px' : '15px';
                                style.height = place.orientation === '40*15' ? '15px' : '40px';
                            }
                        }
                        
                        return (
                            <div key={col} className="flex items-center justify-center" style={{ width: '45px', height: '45px' }}>
                                <div onClick={() => isClickable && onPlaceSelect({placeId: id, warehouseId: warehouseId})} className={`rounded-sm flex items-center justify-center gap-1 ${isClickable ? 'cursor-pointer' : ''} ${isDisabled ? 'opacity-30' : ''} ${isSelected ? 'ring-4 ring-offset-2 ring-red-500' : ''}`} style={{...style, backgroundColor}}>
                                  {place && place.type === 'pallet' && itemsOnThisPlace.length === 0 && <PalletLines orientation={place.orientation === '30*36' ? 'vertical' : 'horizontal'} />}
                                  {place && place.type === 'shelving' && <ShelvingLines orientation={place.orientation === '15*40' ? 'vertical' : 'horizontal'} />}
                                  {place && place.type === 'pallet' && itemsOnThisPlace.map(item => {
                                      const itemType = itemTypes.find(it => it.name === item.type);
                                      return <div key={item.id} style={{ width: '25px', height: '25px', backgroundColor: itemType?.color || '#ccc', flexShrink: 0 }} className="rounded-sm"></div>
                                  })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
const ItemEditor = ({ warehouses, itemTypes, onSave, onCancel, onManageTypes, items, userRole }) => {
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
            const newDisabledPlaces = [];
            (selectedWarehouse.places || []).forEach(place => {
                const itemsOnPlace = items.filter(i => i.placeId === place.id && i.warehouseId === newItem.warehouseId);
                if (newItem.size === 'Паллета') {
                    if (place.type === 'shelving') newDisabledPlaces.push(place.id);
                    if (place.type === 'pallet' && itemsOnPlace.filter(i => i.size === 'Паллета').length >= 2) newDisabledPlaces.push(place.id);
                }
            });
            setDisabledPlaces(newDisabledPlaces);
        }
    }, [newItem.warehouseId, newItem.size, warehouses, items]);

    const handleChange = (e) => { 
        const { name, value } = e.target;
        const processedValue = name === 'warehouseId' ? Number(value) : value;
        setNewItem(prev => ({ ...prev, [name]: processedValue, placeId: name === 'warehouseId' ? null : prev.placeId })); 
    };
    const handleSave = () => { if (!newItem.name || !newItem.type || !newItem.size || !newItem.quantity || !newItem.warehouseId || newItem.placeId === null) { alert('Пожалуйста, заполните все поля и выберите место.'); return; } onSave({ ...newItem, id: crypto.randomUUID() }); };
    const selectedWarehouse = warehouses.find(w => w.id === newItem.warehouseId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Создать позицию</h2>
                <div className="space-y-4">
                    <input type="text" name="name" value={newItem.name} onChange={handleChange} placeholder="Наименование" className="w-full p-3 border rounded-lg" />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Доступные типы:</label>
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                            {itemTypes.map(t => (
                                <div key={t.id} className="flex items-center gap-2 bg-white p-1 pr-2 rounded-full border">
                                    <div style={{ width: '20px', height: '20px', backgroundColor: t.color, borderRadius: '50%' }}></div>
                                    <span className="text-sm">{t.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <select name="type" value={newItem.type} onChange={handleChange} className="w-full p-3 border rounded-lg">
                            {itemTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                        {userRole === 'Администратор' && (
                            <button onClick={onManageTypes} className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300"><EditIcon /></button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select name="size" value={newItem.size} onChange={handleChange} className="w-full p-3 border rounded-lg"><option>Паллета</option><option>Коробка</option><option>Шт</option></select>
                        <input type="number" name="quantity" value={newItem.quantity} onChange={handleChange} placeholder="Количество" min="1" className="w-full p-3 border rounded-lg" />
                    </div>
                    <select name="warehouseId" value={newItem.warehouseId || ''} onChange={handleChange} className="w-full p-3 border rounded-lg">{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
                    {selectedWarehouse && (
                        <div>
                            <h3 className="font-semibold mb-2">Выберите место на складе "{selectedWarehouse.name}"</h3>
                            <div className="max-h-64 overflow-auto p-2 bg-gray-100 rounded-lg">
                                <CompactPlacesGrid places={selectedWarehouse.places || []} onPlaceSelect={(placeInfo) => setNewItem(prev => ({...prev, placeId: placeInfo.placeId}))} selectedPlaceInfo={newItem} disabledPlaces={disabledPlaces} items={items.filter(i => i.warehouseId === selectedWarehouse.id)} itemTypes={itemTypes} warehouseId={selectedWarehouse.id}/>
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
};
const ItemTypesManager = ({ types, onSave, onCancel }) => {
    const [currentTypes, setCurrentTypes] = useState([...types]);
    const [newType, setNewType] = useState({ name: '', color: '#aabbcc' });
    const handleAdd = () => { if (newType.name && !currentTypes.find(t => t.name === newType.name)) { setCurrentTypes([...currentTypes, { ...newType, id: crypto.randomUUID() }]); setNewType({ name: '', color: '#aabbcc' }); } };
    const handleRemove = (idToRemove) => { setCurrentTypes(currentTypes.filter(t => t.id !== idToRemove)); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Типы позиций</h2>
                <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                    {currentTypes.map(t => (
                        <div key={t.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div style={{ width: '30px', height: '30px', backgroundColor: t.color, borderRadius: '4px' }}></div>
                                <span>{t.name}</span>
                            </div>
                            <button onClick={() => handleRemove(t.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 border-t pt-4">
                    <input type="color" value={newType.color} onChange={(e) => setNewType(p => ({...p, color: e.target.value}))} className="p-1 h-12 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none" />
                    <input type="text" value={newType.name} onChange={(e) => setNewType(p => ({...p, name: e.target.value}))} placeholder="Новый тип" className="w-full p-3 border rounded-lg" />
                    <button onClick={handleAdd} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><PlusIcon /></button>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
                    <button onClick={() => onSave(currentTypes)} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить</button>
                </div>
            </div>
        </div>
    );
};
const ItemsOnPlaceModal = ({ place, items, itemTypes, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Позиции на месте #{place.id + 1}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon /></button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {items.length > 0 ? items.map(item => {
                        const itemType = itemTypes.find(it => it.name === item.type);
                        return (
                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg flex items-start gap-3">
                                <div style={{width: '30px', height: '30px', backgroundColor: itemType?.color || '#ccc', borderRadius: '4px', flexShrink: 0}}></div>
                                <div>
                                    <p className="font-bold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">Тип: {item.type} | Размер: {item.size} | Кол-во: {item.quantity}</p>
                                </div>
                            </div>
                        )
                    }) : <p className="text-gray-500 text-center py-4">На этом месте нет позиций.</p>}
                </div>
            </div>
        </div>
    )
};

const ContactsModal = ({ users, warehouses, onClose }) => {
    const displayedRoles = ['Администратор', 'Сотрудник склада', 'Водитель'];
    const relevantUsers = users.filter(user => displayedRoles.includes(user.role));

    const contactsByWarehouse = warehouses.reduce((acc, warehouse) => {
        const warehouseUsers = relevantUsers.filter(user => user.assignedWarehouseId === warehouse.id);
        if (warehouseUsers.length > 0) {
            acc[warehouse.id] = {
                name: warehouse.name,
                users: warehouseUsers
            };
        }
        return acc;
    }, {});

    const officeUsers = relevantUsers.filter(user => user.assignedWarehouseId === 'office' || !warehouses.some(w => w.id === user.assignedWarehouseId));

    const hasWarehouseContacts = Object.keys(contactsByWarehouse).length > 0;
    const hasOfficeContacts = officeUsers.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Контакты сотрудников</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon /></button>
                </div>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                    {!hasWarehouseContacts && !hasOfficeContacts ? (
                        <p className="text-gray-500 text-center py-8">Нет сотрудников для отображения.</p>
                    ) : (
                        <>
                            {Object.values(contactsByWarehouse).map(warehouseData => (
                                <div key={warehouseData.name}>
                                    <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-3">{warehouseData.name}</h3>
                                    <div className="space-y-3">
                                        {warehouseData.users.map(user => (
                                            <div key={user.id} className="bg-gray-50 p-3 rounded-lg">
                                                <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                                                <p className="text-sm text-gray-600">{user.position}</p>
                                                <p className="text-sm text-gray-500 mt-1">Тел: {user.phone}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {hasOfficeContacts && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-3">Офис / Не привязаны</h3>
                                    <div className="space-y-3">
                                        {officeUsers.map(user => (
                                            <div key={user.id} className="bg-gray-50 p-3 rounded-lg">
                                                <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                                                <p className="text-sm text-gray-600">{user.position}</p>
                                                <p className="text-sm text-gray-500 mt-1">Тел: {user.phone}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserModerationModal = ({ users, warehouses, onSave, onDelete, onClose, currentUser }) => {
    const [editingUser, setEditingUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const ROLES = ["Администратор", "Сотрудник склада", "Водитель", "На модерации"];

    const handleEdit = (user) => {
        setEditingUser(user);
        setUserData({ ...user });
    };

    const handleCancel = () => {
        setEditingUser(null);
        setUserData(null);
    };

    const handleSave = () => {
        onSave(userData);
        handleCancel();
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Модерация пользователей</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon /></button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="border-b text-sm text-gray-500">
                            <tr>
                                <th className="p-2">Пользователь</th>
                                <th className="p-2">Роль</th>
                                <th className="p-2">Контакты</th>
                                <th className="p-2">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b">
                                    {editingUser?.id === user.id ? (
                                        <td colSpan="4" className="p-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
                                                <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} placeholder="Имя" className="p-2 border rounded-lg" />
                                                <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Фамилия" className="p-2 border rounded-lg" />
                                                <input type="text" name="position" value={userData.position} onChange={handleChange} placeholder="Должность" className="p-2 border rounded-lg" />
                                                <input type="tel" name="phone" value={userData.phone} onChange={handleChange} placeholder="Телефон" className="p-2 border rounded-lg" />
                                                <select name="role" value={userData.role} onChange={handleChange} className="p-2 border rounded-lg bg-white">
                                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                                <select name="assignedWarehouseId" value={userData.assignedWarehouseId} onChange={handleChange} className="p-2 border rounded-lg bg-white">
                                                  <option value="office">Офис (не привязан к складу)</option>
                                                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                                </select>
                                                <div className="sm:col-span-2 flex gap-2 items-center">
                                                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Сохранить</button>
                                                    <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Отмена</button>
                                                </div>
                                            </div>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="p-2">
                                                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                                <p className="text-sm text-gray-500">@{user.username}</p>
                                            </td>
                                            <td className="p-2">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'На модерации' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-2 text-sm">
                                                <p>{user.position}</p>
                                                <p className="text-gray-500">{user.phone}</p>
                                            </td>
                                            <td className="p-2">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(user)} className="p-2 text-gray-500 hover:text-blue-600"><EditIcon /></button>
                                                    {currentUser.id !== user.id && (
                                                        <button onClick={() => onDelete(user.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ItemMoveModal = ({ itemToMove, warehouses, items, itemTypes, onSave, onCancel }) => {
    const [destination, setDestination] = useState({
        warehouseId: itemToMove.warehouseId,
        placeId: null
    });
    const [disabledPlaces, setDisabledPlaces] = useState([]);

    useEffect(() => {
        const selectedWarehouse = warehouses.find(w => w.id === destination.warehouseId);
        if (!selectedWarehouse) return;

        const otherItems = items.filter(i => i.id !== itemToMove.id);

        const newDisabledPlaces = [];
        (selectedWarehouse.places || []).forEach(place => {
            const itemsOnPlace = otherItems.filter(i => i.placeId === place.id && i.warehouseId === destination.warehouseId);
            if (itemToMove.size === 'Паллета') {
                if (place.type === 'shelving') {
                    newDisabledPlaces.push(place.id);
                }
                if (place.type === 'pallet' && itemsOnPlace.filter(i => i.size === 'Паллета').length >= 2) {
                    newDisabledPlaces.push(place.id);
                }
            }
        });
        setDisabledPlaces(newDisabledPlaces);
        setDestination(prev => ({...prev, placeId: null}));

    }, [destination.warehouseId, itemToMove, warehouses, items]);

    const handleSave = () => {
        if (destination.placeId === null) {
            alert('Пожалуйста, выберите новое место.');
            return;
        }
        onSave(destination);
    };

    const handleWarehouseChange = (e) => {
        const newWarehouseId = Number(e.target.value);
        setDestination({ warehouseId: newWarehouseId, placeId: null });
    };

    const handlePlaceSelect = (placeInfo) => {
        setDestination(prev => ({ ...prev, placeId: placeInfo.placeId }));
    };

    const selectedWarehouse = warehouses.find(w => w.id === destination.warehouseId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Перемещение позиции</h2>
                <p className="mb-6 text-gray-600">"{itemToMove.name}"</p>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Целевой склад:</label>
                    <select name="warehouseId" value={destination.warehouseId} onChange={handleWarehouseChange} className="w-full p-3 border rounded-lg bg-white">
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>

                    {selectedWarehouse && (
                        <div>
                            <h3 className="font-semibold mb-2">Выберите новое место на складе "{selectedWarehouse.name}"</h3>
                            <div className="max-h-64 overflow-auto p-2 bg-gray-100 rounded-lg">
                                <CompactPlacesGrid
                                    places={selectedWarehouse.places || []}
                                    items={items.filter(i => i.warehouseId === selectedWarehouse.id && i.id !== itemToMove.id)}
                                    itemTypes={itemTypes}
                                    onPlaceSelect={handlePlaceSelect}
                                    selectedPlaceInfo={destination}
                                    disabledPlaces={disabledPlaces}
                                    warehouseId={selectedWarehouse.id}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
                    <button onClick={handleSave} disabled={destination.placeId === null} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold disabled:bg-gray-400">Переместить</button>
                </div>
            </div>
        </div>
    );
};

const ItemActionModal = ({ itemToAction, warehouses, items, itemTypes, onMove, onWriteOff, onCancel }) => {
    const [destination, setDestination] = useState({
        warehouseId: itemToAction.warehouseId !== 'unassigned' ? itemToAction.warehouseId : warehouses[0]?.id,
        placeId: null
    });
    const [disabledPlaces, setDisabledPlaces] = useState([]);

    useEffect(() => {
        const selectedWarehouse = warehouses.find(w => w.id === destination.warehouseId);
        if (!selectedWarehouse) return;

        const otherItems = items.filter(i => i.id !== itemToAction.id);
        const newDisabledPlaces = [];
        
        (selectedWarehouse.places || []).forEach(place => {
            const itemsOnPlace = otherItems.filter(i => i.placeId === place.id && i.warehouseId === destination.warehouseId);
            if (itemToAction.size === 'Паллета') {
                if (place.type === 'shelving') newDisabledPlaces.push(place.id);
                if (place.type === 'pallet' && itemsOnPlace.filter(i => i.size === 'Паллета').length >= 2) newDisabledPlaces.push(place.id);
            }
        });
        setDisabledPlaces(newDisabledPlaces);
        if (destination.warehouseId !== itemToAction.warehouseId) {
            setDestination(prev => ({...prev, placeId: null}));
        }

    }, [destination.warehouseId, itemToAction, warehouses, items]);

    const handleMove = () => {
        if (destination.placeId === null) {
            alert('Пожалуйста, выберите новое место для перемещения.');
            return;
        }
        onMove(destination);
    };

    const handleWarehouseChange = (e) => {
        const newWarehouseId = Number(e.target.value);
        setDestination({ warehouseId: newWarehouseId, placeId: null });
    };

    const handlePlaceSelect = (placeInfo) => {
        setDestination(prev => ({ ...prev, placeId: placeInfo.placeId }));
    };

    const selectedWarehouse = warehouses.find(w => w.id === destination.warehouseId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Действия с позицией</h2>
                <p className="mb-6 text-gray-600">"{itemToAction.name}"</p>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Переместить на склад:</label>
                    <select name="warehouseId" value={destination.warehouseId || ''} onChange={handleWarehouseChange} className="w-full p-3 border rounded-lg bg-white">
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>

                    {selectedWarehouse && (
                        <div>
                            <h3 className="font-semibold mb-2">Выберите новое место на складе "{selectedWarehouse.name}"</h3>
                            <div className="max-h-64 overflow-auto p-2 bg-gray-100 rounded-lg">
                                <CompactPlacesGrid
                                    places={selectedWarehouse.places || []}
                                    items={items.filter(i => i.warehouseId === selectedWarehouse.id && i.id !== itemToAction.id)}
                                    itemTypes={itemTypes}
                                    onPlaceSelect={handlePlaceSelect}
                                    selectedPlaceInfo={destination}
                                    disabledPlaces={disabledPlaces}
                                    warehouseId={selectedWarehouse.id}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center items-center gap-x-6 mt-8 w-full">
                    <button 
                        onClick={onCancel} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        aria-label="Отмена"
                    >
                        <XIcon />
                    </button>
                    <button 
                        onClick={() => onWriteOff(itemToAction.id)} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-red-600 hover:bg-red-700 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        aria-label="Списать"
                    >
                        <TrashIcon />
                    </button>
                    <button 
                        onClick={handleMove} 
                        disabled={destination.placeId === null} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-blue-600 hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:shadow-none transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label="Переместить"
                    >
                        <TruckIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

const QRScannerModal = ({ itemToVerify, allItems, onSuccess, onCancel }) => {
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, error
    const [scanError, setScanError] = useState('');

    const startScan = () => {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;

            const onQrTextReceived = (eventData) => {
                tg.closeScanQrPopup();
                const scannedId = eventData.data;
                tg.offEvent('qrTextReceived', onQrTextReceived);

                if (itemToVerify.id !== 'any') {
                    if (scannedId === itemToVerify.id) {
                        onSuccess(itemToVerify);
                    } else {
                        setScanStatus('error');
                        setScanError(`Неверный QR-код. Отсканирован другой товар.`);
                    }
                } else {
                    const foundItem = allItems.find(item => item.id === scannedId);
                    if (foundItem) {
                        onSuccess(foundItem);
                    } else {
                        setScanStatus('error');
                        setScanError(`Позиция с QR-кодом не найдена в системе.`);
                    }
                }
            };

            tg.onEvent('qrTextReceived', onQrTextReceived);
            
            tg.showScanQrPopup({
                text: itemToVerify.id === 'any' 
                    ? 'Наведите на QR-код любого товара' 
                    : `Наведите на QR-код товара "${itemToVerify.name}"`
            });
            setScanStatus('scanning');
            setScanError('');

        } else {
            setScanStatus('error');
            setScanError('Сканер доступен только в приложении Telegram.');
            console.error('Telegram WebApp API not found.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up relative text-center my-auto">
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><XIcon /></button>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Проверка позиции</h2>
                <p className="mb-6 text-gray-600">
                    {itemToVerify.id === 'any'
                        ? 'Нажмите кнопку, чтобы отсканировать QR-код любой позиции для перемещения.'
                        : `Нажмите кнопку, чтобы отсканировать QR-код для позиции: `
                    }
                    {itemToVerify.id !== 'any' && <span className="font-bold">"{itemToVerify.name}"</span>}
                </p>
                
                <button 
                    onClick={startScan} 
                    disabled={scanStatus === 'scanning'}
                    className="w-full px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold transition disabled:bg-gray-400"
                >
                    {scanStatus === 'scanning' ? 'Камера активна...' : 'Сканировать QR-код'}
                </button>

                {scanError && <p className="mt-4 text-red-600 font-semibold bg-red-100 p-3 rounded-lg">{scanError}</p>}
                
                <p className="mt-4 text-sm text-gray-500">
                    Для сканирования будет использована камера вашего устройства через приложение Telegram.
                </p>
            </div>
        </div>
    );
};

const ScenariosModal = ({ onOpenCreate, onOpenView, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Управление сценариями</h2>
                <div className="space-y-4">
                    <button onClick={onOpenCreate} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md">
                        <FilePlusIcon /> Создать сценарий
                    </button>
                    <button onClick={onOpenView} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-600 text-white font-semibold hover:bg-gray-700 transition shadow-md">
                        <EyeIcon /> Просмотреть сценарии
                    </button>
                </div>
            </div>
        </div>
    );
};

const CreateScenarioModal = ({ warehouses, items, users, onCreate, onClose }) => {
    const [step, setStep] = useState(1);
    const [fromWarehouseId, setFromWarehouseId] = useState(warehouses[0]?.id || null);
    const [toWarehouseId, setToWarehouseId] = useState(null);
    const [selectedItems, setSelectedItems] = useState({}); // { itemId: quantity }
    const [driverId, setDriverId] = useState(null);

    const drivers = users.filter(u => u.role === 'Водитель');

    const handleItemToggle = (item) => {
        const newSelectedItems = { ...selectedItems };
        if (newSelectedItems[item.id]) {
            delete newSelectedItems[item.id];
        } else {
            const quantity = prompt(`Введите количество для "${item.name}":`, item.quantity);
            if (quantity && !isNaN(quantity) && Number(quantity) > 0 && Number(quantity) <= item.quantity) {
                newSelectedItems[item.id] = Number(quantity);
            }
        }
        setSelectedItems(newSelectedItems);
    };

    const handleNext = () => {
        if (Object.keys(selectedItems).length === 0) {
            alert('Выберите хотя бы одну позицию для перемещения.');
            return;
        }
        setStep(2);
    };

    const handleCreate = () => {
        if (!toWarehouseId || !driverId) {
            alert('Выберите склад-получатель и водителя.');
            return;
        }
        onCreate({ fromWarehouseId, toWarehouseId, items: selectedItems, driverId });
    };
    
    const itemsOnWarehouse = fromWarehouseId ? items.filter(i => i.warehouseId === fromWarehouseId) : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto">
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Шаг 1: Выбор позиций</h2>
                        <div className="space-y-4">
                            <select value={fromWarehouseId || ''} onChange={e => setFromWarehouseId(Number(e.target.value))} className="w-full p-3 border rounded-lg bg-white">
                                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                            <div className="max-h-64 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-lg">
                                {itemsOnWarehouse.map(item => (
                                    <div key={item.id} onClick={() => handleItemToggle(item)} className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${selectedItems[item.id] ? 'bg-blue-100 border-blue-500 border' : 'bg-white hover:bg-gray-100'}`}>
                                        <span>{item.name} (Доступно: {item.quantity})</span>
                                        {selectedItems[item.id] && <span className="font-bold text-blue-700">Выбрано: {selectedItems[item.id]}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-8">
                            <button onClick={onClose} className="flex items-center justify-center w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300"><XIcon /></button>
                            <button onClick={handleNext} className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-blue-600 hover:bg-blue-700"><ArrowRightIcon /></button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Шаг 2: Назначение</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Склад-получатель:</label>
                                <select value={toWarehouseId || ''} onChange={e => setToWarehouseId(Number(e.target.value))} className="w-full p-3 border rounded-lg bg-white">
                                    <option value="" disabled>Выберите склад</option>
                                    {warehouses.filter(w => w.id !== fromWarehouseId).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Водитель:</label>
                                <select value={driverId || ''} onChange={e => setDriverId(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
                                    <option value="" disabled>Выберите водителя</option>
                                    {drivers.map(d => <option key={d.id} value={d.id