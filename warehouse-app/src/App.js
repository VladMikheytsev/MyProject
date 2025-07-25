import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode';
import SignatureCanvas from 'react-signature-canvas'; // --- [НОВЫЙ] Импорт для подписи ---

// --- Иконки (SVG) ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>;
const TrashIcon = ({ width = "24", height = "24" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
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
const PrintIcon = ({ width = "24", height = "24" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;


// --- API Configuration ---
// !!! ВАЖНО: Вставьте сюда ваш актуальный URL от ngrok !!!
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

  // --- Методы для данных (склады, товары) ---
  fetchAppData: () => api.request('/data'),
  saveAppData: (data) => api.request('/data', 'POST', data),

  // --- Методы для пользователей ---
  fetchUsers: () => api.request('/users'),
  loginUser: (credentials) => api.request('/login', 'POST', credentials),
  registerUser: (userData) => api.request('/register', 'POST', userData),
  updateUser: (userData) => api.request(`/users/${userData.id}`, 'PUT', userData),
  deleteUser: (userId) => api.request(`/users/${userId}`, 'DELETE'),
};


// --- Компоненты дизайна паллет и стеллажей (без изменений) ---
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

// --- [ОБНОВЛЕННЫЙ] Компонент статистики паллет ---
const PalletStats = ({ places = [], items = [] }) => {
    const palletPlaces = places.filter(p => p.type === 'pallet');
    const totalPalletPlaces = palletPlaces.length;

    if (totalPalletPlaces === 0) {
        return <p className="mt-2 text-sm text-center text-gray-500">Паллетные места не сконфигурированы</p>;
    }
    
    const palletPlaceIds = new Set(palletPlaces.map(p => p.id));

    const occupiedPalletPlaceIds = new Set();
    items.forEach(item => {
        if (palletPlaceIds.has(item.placeId)) {
            occupiedPalletPlaceIds.add(item.placeId);
        }
    });

    const occupiedPalletPlacesCount = occupiedPalletPlaceIds.size;
    const freePalletPlacesCount = totalPalletPlaces - occupiedPalletPlacesCount;

    return (
        <div className="mt-2 text-sm text-gray-600 space-y-1">
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

// --- [ОБНОВЛЕННЫЙ КОМПОНЕНТ] Модальное окно для печати QR-кода ---
const QRCodePrintModal = ({ item, user, onClose }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const qrCodePrintRef = useRef();
    const titleRef = useRef(null); // Ref для заголовка

    const handlePrintQRCode = useReactToPrint({
        content: () => qrCodePrintRef.current,
        documentTitle: `QR-Code-${item.name}`,
    });
    
    // Эффект для генерации QR-кода
    useEffect(() => {
        const generateQr = async () => {
            const qrString = item.id;
            try {
                const url = await QRCode.toDataURL(qrString, {
                    width: 256,
                    margin: 2,
                });
                setQrCodeUrl(url);
            } catch (err) {
                console.error('Не удалось сгенерировать QR-код:', err);
            }
        };
        generateQr();
    }, [item]);

    // Эффект для динамического изменения размера шрифта
    useLayoutEffect(() => {
        const element = titleRef.current;
        if (!element || !qrCodeUrl) return;

        const MAX_WIDTH = 256; 
        const MIN_FONT_SIZE = 12;
        const START_FONT_SIZE = 60;

        let currentFontSize = START_FONT_SIZE;
        element.style.fontSize = `${currentFontSize}px`;
        element.style.wordWrap = 'break-word';

        // Эвристика для проверки высоты (не более 2 строк)
        const isTooTall = () => element.scrollHeight > currentFontSize * 2.4;
        
        // Уменьшаем шрифт, пока он не влезет по ширине или высоте
        while ((element.scrollWidth > MAX_WIDTH || isTooTall()) && currentFontSize > MIN_FONT_SIZE) {
            currentFontSize--;
            element.style.fontSize = `${currentFontSize}px`;
        }

    }, [item.name, qrCodeUrl]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up">
                <div ref={qrCodePrintRef} className="text-center p-4 flex flex-col items-center">
                    <h2 
                        ref={titleRef} 
                        className="font-bold text-gray-800" 
                        style={{ maxWidth: '256px', lineHeight: 1.2 }}
                    >
                        {item.name}
                    </h2>
                    <p className="text-xl text-gray-500 mb-4">Тип: {item.type}</p>
                    {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt={`QR-код для ${item.name}`} className="mx-auto" />
                    ) : (
                        <div style={{width: '256px', height: '256px'}} className="bg-gray-200 animate-pulse mx-auto"></div>
                    )}
                    <div className="text-xs text-gray-500 mt-4">
                        <p>Дата печати: {new Date().toLocaleString('ru-RU')}</p>
                        <p>Пользователь: {user.firstName} {user.lastName}</p>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Закрыть</button>
                    <button onClick={handlePrintQRCode} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold flex items-center gap-2">
                        <PrintIcon /> Печать
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Модальные окна ---

// --- [НОВОЕ МОДАЛЬНОЕ ОКНО] Редактор профиля пользователя ---
const ProfileEditorModal = ({ user, warehouses, onSave, onClose }) => {
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
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить</button>
                </div>
            </div>
        </div>
    );
};

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
                            if (onPlaceSelect) { // In selection mode
                                // Keep it clickable
                            } else { // In view mode
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
        setNewItem(prev => ({ ...prev, [name]: value, placeId: name === 'warehouseId' ? null : prev.placeId })); 
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

// --- Модальное окно для действий с позицией (ОБНОВЛЕННЫЙ ДИЗАЙН) ---
const ItemActionModal = ({ itemToAction, warehouses, items, itemTypes, onMove, onWriteOff, onCancel }) => {
    // Состояние для выбора нового места
    const [destination, setDestination] = useState({
        warehouseId: itemToAction.warehouseId !== 'unassigned' ? itemToAction.warehouseId : warehouses[0]?.id,
        placeId: null
    });
    const [disabledPlaces, setDisabledPlaces] = useState([]);

    // Эффект для определения доступных/недоступных мест
    useEffect(() => {
        const selectedWarehouse = warehouses.find(w => w.id === destination.warehouseId);
        if (!selectedWarehouse) return;

        // Все товары, кроме текущего
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
        // Сбрасываем выбранное место при смене склада
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
                    {/* Кнопка Отмена (иконка выхода) */}
                    <button 
                        onClick={onCancel} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        aria-label="Отмена"
                    >
                        <XIcon />
                    </button>
                    
                    {/* Кнопка Списать (иконка корзины) */}
                    <button 
                        onClick={() => onWriteOff(itemToAction.id)} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-red-600 hover:bg-red-700 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        aria-label="Списать"
                    >
                        <TrashIcon />
                    </button>

                    {/* Кнопка Переместить (иконка перемещения) */}
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

// --- [ОБНОВЛЕННЫЙ КОМПОНЕНТ] Модальное окно для сценариев ---
const ScenariosModal = ({ scenarios, warehouses, items, users, currentUser, onUpdateStatus, onOpenCreate, onClose, onDelete, onPrint }) => {
    const getUserNameById = (userId) => {
        if (!userId) return 'Неизвестно';
        const user = users.find(u => u.id === userId);
        return user ? `${user.firstName} ${user.lastName.charAt(0)}.` : 'Неизвестно';
    };
    
    const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || 'Неизвестно';
    
    const StatusIndicator = ({ status }) => {
        if (status === 'accepted') {
            return <span className="flex items-center gap-1 text-yellow-600"><ClockIcon /> В работе</span>;
        }
        if (status === 'completed') {
            return <span className="flex items-center gap-1 text-green-600"><CheckCircleIcon /> Завершено</span>;
        }
        return <span className="text-gray-600">Новый</span>;
    };
    
    let userScenarios = (currentUser.role === 'Водитель')
        ? scenarios.filter(s => s.driverId === currentUser.id)
        : scenarios;

    if (currentUser.role !== 'Администратор') {
        userScenarios = userScenarios.filter(s => s.status !== 'completed');
    }

    const statusOrder = { 'new': 1, 'accepted': 2, 'completed': 3 };
    userScenarios.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Управление задачами</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon /></button>
                </div>

                {currentUser.role !== 'Водитель' && (
                    <button onClick={onOpenCreate} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md mb-4">
                        <FilePlusIcon /> Новая задача
                    </button>
                )}
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto border-t pt-4">
                    {userScenarios.length > 0 ? userScenarios.map(s => (
                        <div key={s.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">Документ #{s.number}</p>
                                    <p className="text-xs text-gray-400 mb-2">Создан: {new Date(s.createdAt).toLocaleString('ru-RU')}</p>
                                    <p><span className="font-semibold">Из:</span> {getWarehouseName(s.fromWarehouseId)}</p>
                                    <p><span className="font-semibold">В:</span> {getWarehouseName(s.toWarehouseId)}</p>
                                    <div className="text-sm text-gray-600 mt-2 border-t pt-2 space-y-1">
                                         <p>Отправитель: {getUserNameById(s.creatorId)}</p>
                                         {(s.status === 'accepted' || s.status === 'completed') && <p>Водитель: {getUserNameById(s.driverId)}</p>}
                                         {s.status === 'completed' && <p>Получатель: {getUserNameById(s.completerId)}</p>}
                                    </div>
                                </div>
                                <div className="text-sm font-semibold">
                                    <StatusIndicator status={s.status} />
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                                <p className="font-semibold text-sm mb-1">Позиции:</p>
                                <ul className="text-sm text-gray-700 space-y-2">
                                    {Object.entries(s.items).map(([itemId, quantity]) => {
                                        const item = items.find(i => i.id === itemId);
                                        return (
                                            <li key={itemId} className="flex justify-between items-center border-b border-dashed border-gray-300 last:border-b-0 pb-2">
                                                <span>{item?.name || 'Неизвестная позиция'} - {quantity} шт.</span>
                                                <span className="text-gray-500">{item?.type || ''}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="mt-4 flex gap-4 items-center">
                                {currentUser.id === s.driverId && s.status === 'new' && (
                                    <button onClick={() => onUpdateStatus(s, 'accepted')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Принять</button>
                                )}
                                {(currentUser.role === 'Администратор' || currentUser.role === 'Сотрудник склада') && s.status === 'accepted' && (
                                     <button onClick={() => onUpdateStatus(s, 'completed')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Завершить</button>
                                )}
                                <div className="ml-auto flex items-center gap-2">
                                  {currentUser.role === 'Администратор' && (
                                      <button onClick={() => onDelete(s.id)} className="p-2 text-red-500 bg-red-100 hover:bg-red-200 rounded-full">
                                          <TrashIcon width="20" height="20" />
                                      </button>
                                  )}
                                  <button onClick={() => onPrint(s)} className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full" aria-label={`Печать документа #${s.number}`}>
                                      <PrintIcon width="20" height="20" />
                                  </button>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-center text-gray-500 py-8">Нет доступных задач.</p>}
                </div>
            </div>
        </div>
    );
};

const CreateScenarioModal = ({ scenarios, items, users, onCreate, onClose, warehouses }) => {
    const [step, setStep] = useState(1);
    const [fromWarehouseId, setFromWarehouseId] = useState(warehouses[0]?.id || null);
    const [toWarehouseId, setToWarehouseId] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});
    const [driverId, setDriverId] = useState(null);
    const signatureRef = useRef(null);

    const drivers = users.filter(u => u.role === 'Водитель');

    const activeScenarios = scenarios.filter(s => s.status === 'new' || s.status === 'accepted');
    const lockedItemIds = new Set(activeScenarios.flatMap(s => Object.keys(s.items)));

    const itemsOnWarehouse = fromWarehouseId
        ? items.filter(i => i.warehouseId === fromWarehouseId && !lockedItemIds.has(i.id))
        : [];

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

    const handleNextToSignature = () => {
        if (!toWarehouseId || !driverId) {
            alert('Выберите склад-получатель и водителя.');
            return;
        }
        setStep(3);
    };

    const handleCreate = () => {
        if (signatureRef.current.isEmpty()) {
            alert('Пожалуйста, поставьте свою подпись.');
            return;
        }
        const signatureData = signatureRef.current.toDataURL();
        onCreate({ fromWarehouseId, toWarehouseId, items: selectedItems, driverId, signatureData });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto">
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Новая задача: Шаг 1/3 - Выбор товаров</h2>
                        <div className="space-y-4">
                            <select value={fromWarehouseId || ''} onChange={e => setFromWarehouseId(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
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
                            <button onClick={() => setStep(2)} disabled={Object.keys(selectedItems).length === 0} className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"><ArrowRightIcon /></button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Новая задача: Шаг 2/3 - Назначение</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Склад-получатель:</label>
                                <select value={toWarehouseId || ''} onChange={e => setToWarehouseId(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
                                    <option value="" disabled>Выберите склад</option>
                                    {warehouses.filter(w => w.id !== fromWarehouseId).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Водитель:</label>
                                <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-lg">
                                    {drivers.map(d => (
                                        <button 
                                            key={d.id} 
                                            onClick={() => setDriverId(d.id)}
                                            className={`w-full text-left p-3 rounded-lg ${driverId === d.id ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            {d.firstName} {d.lastName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-8">
                            <button onClick={() => setStep(1)} className="flex items-center justify-center w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300"><ArrowLeftIcon /></button>
                            <button onClick={handleNextToSignature} disabled={!toWarehouseId || !driverId} className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"><ArrowRightIcon /></button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Новая задача: Шаг 3/3 - Подпись</h2>
                        <p className="text-gray-600 mb-4">Пожалуйста, поставьте вашу подпись для подтверждения создания задачи.</p>
                        <div className="bg-gray-100 rounded-lg border-2 border-dashed">
                             <SignatureCanvas ref={signatureRef} canvasProps={{ className: 'w-full h-48' }} />
                        </div>
                         <div className="flex justify-center gap-4 mt-4">
                             <button onClick={() => signatureRef.current.clear()} className="text-sm font-semibold text-gray-600 hover:text-black">Очистить</button>
                         </div>
                        <div className="flex justify-between items-center mt-8">
                            <button onClick={() => setStep(2)} className="flex items-center justify-center w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300"><ArrowLeftIcon /></button>
                            <button onClick={handleCreate} className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-green-600 hover:bg-green-700"><CheckCircleIcon /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const LoginView = ({ onLogin, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError('Имя пользователя и пароль обязательны.');
            return;
        }
        try {
            await onLogin({ username, password });
        } catch (err) {
            setError(err.message || 'Не удалось войти. Пожалуйста, проверьте свои учетные данные.');
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800">Вход в систему</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Имя пользователя" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Войти</button>
                </form>
                <div className="text-center">
                    <button onClick={onSwitchToRegister} className="text-sm font-medium text-blue-600 hover:underline">
                        Нет аккаунта? Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
};

const RegisterView = ({ onRegister, onSwitchToLogin, warehouses }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        position: '',
        phone: '',
        assignedWarehouseId: 'office'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const { username, password, firstName, lastName, position, phone } = formData;
        if (!username || !password || !firstName || !lastName || !position || !phone) {
            setError('Все поля обязательны для заполнения.');
            return;
        }
        try {
            await onRegister(formData);
        } catch (err) {
            setError(err.message || 'Не удалось зарегистрироваться.');
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800">Регистрация</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Имя пользователя (логин)" className="w-full p-3 border rounded-lg" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Пароль" className="w-full p-3 border rounded-lg" />
                    <hr/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Имя" className="w-full p-3 border rounded-lg" />
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Фамилия" className="w-full p-3 border rounded-lg" />
                    </div>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Должность" className="w-full p-3 border rounded-lg" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Телефон" className="w-full p-3 border rounded-lg" />
                    <select name="assignedWarehouseId" value={formData.assignedWarehouseId} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                        <option value="office">Офис (не привязан к складу)</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Зарегистрироваться</button>
                </form>
                <div className="text-center">
                    <button onClick={onSwitchToLogin} className="text-sm font-medium text-blue-600 hover:underline">
                        Уже есть аккаунт? Войти
                    </button>
                </div>
            </div>
        </div>
    );
};

const PendingModerationView = ({ onLogout }) => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 text-center bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ожидание подтверждения</h2>
                <p className="text-gray-600 mb-6">Ваш аккаунт находится на проверке. Вы получите доступ к приложению после одобрения администратором.</p>
                <button onClick={onLogout} className="flex items-center justify-center w-full gap-2 px-4 py-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 font-semibold transition">
                    <LogOutIcon />
                    <span>Выйти</span>
                </button>
            </div>
        </div>
    );
};

// --- [ОБНОВЛЕННЫЙ] Компонент для отображения мест на одном складе ---
const WarehousePlacesBlock = ({ warehouse, items, itemTypes, isExpanded, onToggleExpand, onPlaceSelect, onEditPlaces, userRole }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <div onClick={onToggleExpand} className="flex justify-between items-center cursor-pointer group">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">{warehouse.name}</h3>
                <div className="flex items-center gap-2">
                    {userRole === 'Администратор' && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Предотвратить сворачивание/разворачивание
                                onEditPlaces(warehouse.id);
                            }}
                            className="text-gray-400 hover:text-blue-600 transition p-1 z-10"
                            aria-label={`Редактировать места на складе ${warehouse.name}`}
                        >
                            <EditIcon />
                        </button>
                    )}
                    {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <PalletStats places={warehouse.places || []} items={items.filter(i => i.warehouseId === warehouse.id)} />
            </div>

            {isExpanded && (
                <div className="mt-4">
                    {(warehouse.places && warehouse.places.length > 0) ? (
                        <div className="overflow-auto">
                            <CompactPlacesGrid
                                places={warehouse.places}
                                items={items.filter(i => i.warehouseId === warehouse.id)}
                                itemTypes={itemTypes}
                                onPlaceSelect={onPlaceSelect}
                                warehouseId={warehouse.id}
                            />
                        </div>
                    ) : (
                         <div className="text-center text-gray-400 py-8">
                            <span>Места не сконфигурированы. Нажмите иконку </span>
                            <EditIcon />
                            <span> в заголовке, чтобы их настроить.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- [ИЗМЕНЕНО] Компонент для печатной формы с загрузкой логотипа с бэкенда ---
const ScenarioPrintDocument = React.forwardRef(({ scenario, warehouses, items, users, signatures }, ref) => {
    const getUserNameById = (userId) => {
        if (!userId) return '';
        const user = users.find(u => u.id === userId);
        return user ? `${user.firstName} ${user.lastName.charAt(0)}.` : 'Неизвестно';
    };

    const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || 'Неизвестно';
    const getFullItemDetails = (itemId) => items.find(i => i.id === itemId);
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    // [ИЗМЕНЕНО] Формируем URL к логотипу на нашем бэкенде
    const logoUrl = `${API_BASE_URL}/static/logo.png`;

    return (
        <div ref={ref} style={{ 
            padding: '2cm', 
            fontFamily: 'sans-serif', 
            position: 'relative', 
            minHeight: '90vh' 
        }}>
            {/* Используем сформированный URL в src */}
            <img
                src={logoUrl}
                alt="Logo"
                style={{
                    position: 'absolute',
                    top: '2cm',
                    right: '2cm',
                    width: '150px',
                    height: 'auto'
                }}
            />

            {/* Контент документа */}
            <header style={{ textAlign: 'left', marginBottom: '40px' }}>
                <p><strong>Company:</strong> Diva Fam Inc.</p>
                <p><strong>Document number:</strong> {scenario.number}</p>
                <p><strong>Transfer date:</strong> {new Date(scenario.createdAt).toLocaleDateString('ru-RU')}</p>
                <p><strong>From Warehouse:</strong> {getWarehouseName(scenario.fromWarehouseId)}</p>
                <p><strong>To Warehouse:</strong> {getWarehouseName(scenario.toWarehouseId)}</p>
            </header>

            <main style={{ flexGrow: 1 }}>
                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                    <h2 style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Transferred Products/Materials:</h2>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '12px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Product/Material Name</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Size</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Weight</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Lot Number</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Production date</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(scenario.items).map(([itemId, quantity]) => {
                            const item = getFullItemDetails(itemId);
                            return item ? (
                                <tr key={itemId}>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{item.name}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{item.type}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{item.size}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{quantity}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}></td>
                                </tr>
                            ) : null;
                        })}
                    </tbody>
                </table>
            </main>

            <footer style={{ paddingTop: '40px', fontSize: '14px', lineHeight: '50px' }}>
                <p style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                    <span style={{ width: '5cm', flexShrink: 0 }}>
                        <strong>Transferred by:</strong>
                    </span>
                    <span style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <span>{getUserNameById(scenario.creatorId)}</span>
                        {signatures[scenario.creatorSignatureId] && <img src={signatures[scenario.creatorSignatureId]} alt="signature" style={{height: '50px', margin: '0 1.5em'}} />}
                        <span style={{ position: 'absolute', left: '6cm' }}>{currentDate}</span>
                    </span>
                </p>
                <p style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                    <span style={{ width: '5cm', flexShrink: 0 }}>
                        <strong>Driver:</strong>
                    </span>
                    <span style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <span>{getUserNameById(scenario.driverId)}</span>
                        {signatures[scenario.driverSignatureId] && <img src={signatures[scenario.driverSignatureId]} alt="signature" style={{height: '50px', margin: '0 1.5em'}} />}
                        <span style={{ position: 'absolute', left: '6cm' }}>{currentDate}</span>
                    </span>
                </p>
                <p style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                    <span style={{ width: '5cm', flexShrink: 0 }}>
                        <strong>Received by:</strong>
                    </span>
                    <span style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <span>{getUserNameById(scenario.completerId)}</span>
                        {signatures[scenario.completerSignatureId] && <img src={signatures[scenario.completerSignatureId]} alt="signature" style={{height: '50px', margin: '0 1.5em'}} />}
                        <span style={{ position: 'absolute', left: '6cm' }}>{currentDate}</span>
                    </span>
                </p>
            </footer>

        </div>
    );
});

// --- [НОВЫЙ] Модальное окно для подтверждения действия с подписью ---
const ActionConfirmationModal = ({ title, onConfirm, onCancel }) => {
    const signatureRef = useRef(null);

    const handleConfirm = () => {
        if (signatureRef.current.isEmpty()) {
            alert('Пожалуйста, поставьте подпись для подтверждения.');
            return;
        }
        const signatureData = signatureRef.current.toDataURL();
        onConfirm(signatureData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-600 mb-4">Пожалуйста, поставьте вашу подпись для подтверждения действия.</p>
                <div className="bg-gray-100 rounded-lg border-2 border-dashed">
                    <SignatureCanvas ref={signatureRef} canvasProps={{ className: 'w-full h-48' }} />
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <button onClick={() => signatureRef.current.clear()} className="text-sm font-semibold text-gray-600 hover:text-black">Очистить</button>
                </div>
                <div className="flex justify-between items-center mt-8">
                    <button onClick={onCancel} className="flex items-center justify-center w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300">
                        <ArrowLeftIcon />
                    </button>
                    <button onClick={handleConfirm} className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-green-600 hover:bg-green-700">
                        <CheckCircleIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Основной компонент приложения ---
export default function App() {
  // --- Состояние аутентификации ---
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login'); 
  const [authChecked, setAuthChecked] = useState(false);

  // --- Состояние приложения ---
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [signatures, setSignatures] = useState({}); // --- [НОВОЕ] Хранилище подписей ---
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [isPlacesEditorOpen, setPlacesEditorOpen] = useState(false);
  const [isWarehouseListOpen, setWarehouseListOpen] = useState(false);
  const [isItemEditorOpen, setItemEditorOpen] = useState(false);
  const [isItemTypesManagerOpen, setItemTypesManagerOpen] = useState(false);
  const [viewingPlaceInfo, setViewingPlaceInfo] = useState(null);
  const [activeItemTypeFilter, setActiveItemTypeFilter] = useState('all');
  const [isContactsModalOpen, setContactsModalOpen] = useState(false);
  const [isUserModerationModalOpen, setUserModerationModalOpen] = useState(false);
  const [isProfileEditorOpen, setProfileEditorOpen] = useState(false);
  const [movingItem, setMovingItem] = useState(null); 
  const [verifyingItem, setVerifyingItem] = useState(null);
  const [itemToAction, setItemToAction] = useState(null); 
  const [itemToPrint, setItemToPrint] = useState(null);
  const [isScenariosModalOpen, setScenariosModalOpen] = useState(false);
  const [isCreateScenarioModalOpen, setCreateScenarioModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // --- [НОВОЕ] Для подтверждения действий с подписью ---
  
  const [isPlacesSectionExpanded, setIsPlacesSectionExpanded] = useState(true);
  const [expandedWarehouses, setExpandedWarehouses] = useState([]);
  
  const [scenarioToPrint, setScenarioToPrint] = useState(null);
  const scenarioPrintRef = useRef();
  
  const hasLoadedData = useRef(false);
  const SESSION_STORAGE_KEY = 'warehouseAppSession';

  const handlePrintScenario = useReactToPrint({
      content: () => scenarioPrintRef.current,
      onAfterPrint: () => setScenarioToPrint(null),
  });

  useEffect(() => {
      if (scenarioToPrint) {
          handlePrintScenario();
      }
  }, [scenarioToPrint, handlePrintScenario]);

  // --- Обработчики аутентификации и модерации ---
  const handleLogin = async (credentials) => {
      const user = await api.loginUser(credentials);
      const now = new Date().getTime();
      setCurrentUser(user);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: user, loginTime: now }));
  };

  const handleRegister = async (formData) => {
      const newUser = await api.registerUser(formData);
      const now = new Date().getTime();
      setCurrentUser(newUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: newUser, loginTime: now }));
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      hasLoadedData.current = false;
      setWarehouses([]);
      setItems([]);
      setScenarios([]);
      setSignatures({});
      setSelectedWarehouseId(null);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
        const savedUser = await api.updateUser(updatedUser);
        setUsers(users.map(u => u.id === savedUser.id ? savedUser : u));

        if (currentUser && savedUser.id === currentUser.id) {
            setCurrentUser(savedUser);
            const now = new Date().getTime();
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: savedUser, loginTime: now }));
        }
    } catch (error) {
        console.error("Не удалось обновить пользователя:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
        await api.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
        console.error("Не удалось удалить пользователя:", error);
    }
  };


  // --- Эффекты ---
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      let sessionUser = null;
      try {
        const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
        if (savedSession) {
          const { user, loginTime } = JSON.parse(savedSession);
          const now = new Date().getTime();
          const ONE_HOUR = 3600 * 1000;
          if (now - loginTime < ONE_HOUR) {
            sessionUser = user;
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: user, loginTime: now }));
          } else {
            localStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Не удалось проверить сеанс:", error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
      
      setAuthChecked(true);
      
      if (sessionUser) {
        setCurrentUser(sessionUser);
      } else {
        try {
            // Загружаем только склады для экрана регистрации
            const appData = await api.fetchAppData();
            setWarehouses(appData.warehouses || []);
        } catch(error) {
            console.error("Не удалось загрузить склады для регистрации:", error);
        }
      }
    };

    initializeApp();
  }, []);
  
  // Эффект для загрузки данных после входа или восстановления сессии
  useEffect(() => {
      const loadDataForUser = async () => {
          if (currentUser && currentUser.role !== 'На модерации' && !hasLoadedData.current) {
              setLoading(true);
              try {
                  const [appData, usersData] = await Promise.all([
                      api.fetchAppData(),
                      api.fetchUsers()
                  ]);
                  setWarehouses(appData.warehouses || []);
                  setItems(appData.items || []);
                  setItemTypes(appData.itemTypes || []);
                  setScenarios(appData.scenarios || []);
                  setSignatures(appData.signatures || {});
                  setUsers(usersData || []);
                  // По умолчанию разворачиваем все блоки складов
                  setExpandedWarehouses((appData.warehouses || []).map(w => w.id));
                  hasLoadedData.current = true;
              } catch (error) {
                  console.error("Не удалось загрузить данные пользователя:", error);
              } finally {
                  setLoading(false);
              }
          }
      };
      loadDataForUser();
  }, [currentUser]);

  useEffect(() => {
    if (!hasLoadedData.current || !currentUser || (loading && !hasLoadedData.current)) return;
    
    const fullState = { warehouses, items, itemTypes, scenarios, signatures };
    api.saveAppData(fullState).catch(error => {
      console.error("Ошибка при автоматическом сохранении данных:", error);
    });
  }, [warehouses, items, itemTypes, scenarios, signatures, currentUser, loading]);

  // --- Эффект для автоматического обновления данных (Polling) ---
    const stateRef = useRef();
    stateRef.current = { warehouses, items, itemTypes, scenarios, signatures, users, editingWarehouse, isPlacesEditorOpen, isItemEditorOpen, isItemTypesManagerOpen, movingItem, itemToAction, isCreateScenarioModalOpen, verifyingItem };

    useEffect(() => {
        if (!currentUser || currentUser.role === 'На модерации') {
            return;
        }

        const intervalId = setInterval(async () => {
            const currentState = stateRef.current;
            const isEditing = currentState.editingWarehouse || currentState.isPlacesEditorOpen || currentState.isItemEditorOpen || currentState.isItemTypesManagerOpen || currentState.movingItem || currentState.itemToAction || currentState.isCreateScenarioModalOpen || currentState.verifyingItem;

            if (isEditing) {
                return;
            }

            try {
                const [newData, newUsers] = await Promise.all([api.fetchAppData(), api.fetchUsers()]);

                const currentAppData = { warehouses: currentState.warehouses, items: currentState.items, itemTypes: currentState.itemTypes, scenarios: currentState.scenarios, signatures: currentState.signatures };
                if (JSON.stringify(newData) !== JSON.stringify(currentAppData)) {
                    setWarehouses(newData.warehouses || []);
                    setItems(newData.items || []);
                    setItemTypes(newData.itemTypes || []);
                    setScenarios(newData.scenarios || []);
                    setSignatures(newData.signatures || {});
                }

                if (JSON.stringify(newUsers) !== JSON.stringify(currentState.users)) {
                    setUsers(newUsers || []);
                }
            } catch (error) {
                console.error("Ошибка при фоновом обновлении данных:", error);
            }
        }, 5000); // Опрос каждые 5 секунд

        return () => clearInterval(intervalId); // Очистка интервала
    }, [currentUser]);


  // --- Обработчики действий в приложении ----
  const handleSaveWarehouse = (data) => {
    const savedData = { ...data, id: data.id || crypto.randomUUID() };
    setWarehouses(prev => {
        const exists = prev.some(w => w.id === savedData.id);
        if (exists) return prev.map(w => w.id === savedData.id ? { ...savedData, places: w.places } : w);
        return [...prev, { ...savedData, places: [] }];
    });
    setSelectedWarehouseId(savedData.id);
    setEditingWarehouse(null);
  };
  const handleSavePlaces = (placesData) => {
    setWarehouses(prev => prev.map(w => w.id === selectedWarehouseId ? { ...w, places: placesData } : w));
    setPlacesEditorOpen(false);
  };
  const handleSaveItem = (itemData) => {
    setItems(prev => [...prev, itemData]);
    setItemEditorOpen(false);
  };
  const handleSaveItemTypes = (types) => {
    setItemTypes(types);
    setItemTypesManagerOpen(false);
  };

  const handleSaveItemMove = (destination) => {
    setItems(prevItems => prevItems.map(item =>
        item.id === movingItem.id
            ? { ...item, warehouseId: destination.warehouseId, placeId: destination.placeId }
            : item
    ));
    setMovingItem(null);
  };

  const handleMoveItem = (destination) => {
    setItems(prevItems => prevItems.map(item =>
        item.id === itemToAction.id
            ? { ...item, warehouseId: destination.warehouseId, placeId: destination.placeId }
            : item
    ));
    setItemToAction(null);
  };

  const handleWriteOffItem = (itemId) => {
    if (window.confirm('Вы уверены, что хотите списать эту позицию? Это действие необратимо.')) {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        setItemToAction(null);
    }
  };
  
  const handleCreateScenario = (scenarioData) => {
    const { signatureData, ...restOfData } = scenarioData;
    const signatureId = `sig_${crypto.randomUUID()}`;
    setSignatures(prev => ({...prev, [signatureId]: signatureData }));

    const newScenario = {
      ...restOfData,
      creatorSignatureId: signatureId,
      id: crypto.randomUUID(),
      number: Math.max(0, ...scenarios.map(s => s.number || 0)) + 1,
      status: 'new',
      creatorId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setScenarios(prev => [...prev, newScenario]);
    setCreateScenarioModalOpen(false);
  };
  
  const handleConfirmActionWithSignature = (signatureData) => {
        if (!pendingAction) return;

        const { scenario, newStatus } = pendingAction;
        const signatureId = `sig_${crypto.randomUUID()}`;
        setSignatures(prev => ({ ...prev, [signatureId]: signatureData }));

        setScenarios(prevScenarios =>
            prevScenarios.map(s => {
                if (s.id === scenario.id) {
                    const updatedScenario = { ...s, status: newStatus };
                    if (newStatus === 'accepted') {
                        updatedScenario.driverSignatureId = signatureId;
                    }
                    if (newStatus === 'completed') {
                        updatedScenario.completerId = currentUser.id;
                        updatedScenario.completerSignatureId = signatureId;
                        const itemIdsToMove = Object.keys(updatedScenario.items);
                        const destinationWarehouseId = updatedScenario.toWarehouseId;
                        setItems(prevItems =>
                            prevItems.map(item => {
                                if (itemIdsToMove.includes(item.id)) {
                                    return { ...item, warehouseId: destinationWarehouseId, placeId: null };
                                }
                                return item;
                            })
                        );
                    }
                    return updatedScenario;
                }
                return s;
            })
        );
        setPendingAction(null);
    };
  
  const handleDeleteScenario = (scenarioId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот сценарий? Это действие необратимо.')) {
        setScenarios(prevScenarios => prevScenarios.filter(s => s.id !== scenarioId));
    }
  };


  const handleVerificationSuccess = (verifiedItem) => {
    setMovingItem(verifiedItem);
    setVerifyingItem(null);
  };
  
  const handleStartAddNewWarehouse = () => { setWarehouseListOpen(false); setEditingWarehouse({}); };
  const handleStartEditWarehouse = (warehouse) => { setWarehouseListOpen(false); setEditingWarehouse(warehouse); };
  const handleSelectWarehouse = (id) => { setSelectedWarehouseId(id); setWarehouseListOpen(false); };
  
  const handleDeleteWarehouse = (warehouseIdToDelete) => {
    setWarehouses(prev => prev.filter(w => w.id !== warehouseIdToDelete));
    setItems(prev => prev.map(i => i.warehouseId === warehouseIdToDelete ? { ...i, warehouseId: 'unassigned', placeId: null } : i));
    if (selectedWarehouseId === warehouseIdToDelete) {
        setSelectedWarehouseId(null);
    }
    setWarehouseListOpen(false);
  };
  
  const handleResetPlaces = (warehouseId) => {
    setItems(prevItems =>
        prevItems.map(item =>
            item.warehouseId === warehouseId ? { ...item, warehouseId: 'unassigned', placeId: null } : item
        )
    );
    setWarehouses(prevWarehouses =>
        prevWarehouses.map(w =>
            w.id === warehouseId ? { ...w, places: [] } : w
        )
    );
    setPlacesEditorOpen(false);
  };

  const toggleWarehouseExpansion = (warehouseId) => {
    setExpandedWarehouses(prev =>
        prev.includes(warehouseId)
            ? prev.filter(id => id !== warehouseId)
            : [...prev, warehouseId]
    );
  };
  
  const calculateFreePalletSpaces = (warehouse, allItems) => {
    const palletPlaces = (warehouse.places || []).filter(p => p.type === 'pallet');
    const totalPalletPlaces = palletPlaces.length;
    if (totalPalletPlaces === 0) return 0;

    const palletPlaceIds = new Set(palletPlaces.map(p => p.id));
    const occupiedPalletPlaceIds = new Set();
    allItems.filter(item => item.warehouseId === warehouse.id).forEach(item => {
        if (palletPlaceIds.has(item.placeId)) {
            occupiedPalletPlaceIds.add(item.placeId);
        }
    });
    return totalPalletPlaces - occupiedPalletPlaceIds.size;
  };

  // --- Рендеринг ---
  if (!authChecked) {
    return <div className="w-full h-screen flex items-center justify-center bg-gray-100"><div className="text-lg font-semibold text-gray-500">Проверка сессии...</div></div>;
  }

  if (!currentUser) {
      if (authView === 'login') {
          return <LoginView onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
      }
      return <RegisterView onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} warehouses={warehouses} />;
  }
  
  if (currentUser.role === 'На модерации') {
      return <PendingModerationView onLogout={handleLogout} />
  }

  if (loading && !hasLoadedData.current) return <div className="w-full h-screen flex items-center justify-center bg-gray-100"><div className="text-lg font-semibold text-gray-500">Загрузка данных с сервера...</div></div>;

  const userRole = currentUser.role;
  let warehousesToDisplay = selectedWarehouseId === null ? warehouses : warehouses.filter(w => w.id === selectedWarehouseId);

    if (selectedWarehouseId === null) {
        warehousesToDisplay.sort((a, b) => {
            const freeA = calculateFreePalletSpaces(a, items);
            const freeB = calculateFreePalletSpaces(b, items);
            return freeB - freeA;
        });
    }

  const itemsToDisplay = selectedWarehouseId === null ? items : items.filter(i => i.warehouseId === selectedWarehouseId || i.warehouseId === 'unassigned');
  
  const activeScenarios = scenarios.filter(s => s.status === 'new' || s.status === 'accepted');
  const lockedItemIds = new Set(activeScenarios.flatMap(s => Object.keys(s.items)));
  
  const filteredAndSortedItems = (list) => {
      const filtered = (activeItemTypeFilter === 'all'
          ? list
          : list.filter(item => item.type === activeItemTypeFilter)
      );
      return filtered.sort((a, b) => {
          const aIsLocked = lockedItemIds.has(a.id);
          const bIsLocked = lockedItemIds.has(b.id);
          if (aIsLocked === bIsLocked) return 0;
          return aIsLocked ? 1 : -1;
      });
  };

  const sortedAssignedFilteredItems = filteredAndSortedItems(itemsToDisplay.filter(item => item.warehouseId !== 'unassigned'));
  const sortedUnassignedFilteredItems = filteredAndSortedItems(items.filter(item => item.warehouseId === 'unassigned'));


  const viewingPlace = warehouses.find(w => w.id === viewingPlaceInfo?.warehouseId)?.places?.find(p => p.id === viewingPlaceInfo?.placeId);
  const itemsOnViewingPlace = items.filter(i => i.placeId === viewingPlaceInfo?.placeId && i.warehouseId === viewingPlaceInfo?.warehouseId);
  const notificationCount = scenarios.filter(s => s.status === 'new' || s.status === 'accepted').length;

  const isActionableUser = userRole === 'Администратор' || userRole === 'Сотрудник склада';

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto mb-4">
        <div className="bg-white p-3 rounded-xl shadow-md flex items-center justify-between gap-4 flex-wrap">
            <button onClick={() => setProfileEditorOpen(true)} className="flex items-center justify-center p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold transition">
                <UserIcon />
            </button>
            <div className="flex items-center gap-2 flex-1 justify-end max-w-xs sm:max-w-[160px]">
                {userRole === 'Администратор' && (
                    <button onClick={() => setUserModerationModalOpen(true)} className="flex flex-1 items-center justify-center p-2 rounded-lg text-purple-600 bg-purple-100 hover:bg-purple-200 font-semibold transition">
                        <UsersIcon />
                    </button>
                )}
                <button onClick={() => setContactsModalOpen(true)} className="flex flex-1 items-center justify-center p-2 rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 font-semibold transition">
                    <ContactsIcon />
                </button>
                <button onClick={handleLogout} className="flex flex-1 items-center justify-center p-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 font-semibold transition">
                    <LogOutIcon />
                </button>
            </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        {warehouses.length > 0 ? (
            <div className="space-y-6">
                 <div className="bg-white rounded-xl shadow-md p-5">
                        <div onClick={() => setWarehouseListOpen(true)} className="cursor-pointer group hover:bg-gray-50 mb-3 -mx-2 -mt-2 p-2 rounded-lg transition">
                            <div className="flex items-center">
                                <h3 className="text-2xl font-bold text-gray-900">{selectedWarehouseId === null ? "Все склады" : warehouses.find(w=>w.id === selectedWarehouseId)?.name}</h3>
                                <ChevronDownIcon className="ml-2 text-gray-400 group-hover:text-blue-600"/>
                            </div>
                            {selectedWarehouseId !== null && <p className="text-gray-600">{warehouses.find(w=>w.id === selectedWarehouseId)?.address}</p>}
                        </div>
                        {selectedWarehouseId !== null ? (
                            <div className="border-t pt-4">
                                <p className="text-gray-600">{warehouses.find(w=>w.id === selectedWarehouseId)?.hours}</p>
                                <p className="text-gray-600 mt-1">Ворота: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{warehouses.find(w=>w.id === selectedWarehouseId)?.gate_code}</span></p>
                                <p className="text-gray-600">Замок: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{warehouses.find(w=>w.id === selectedWarehouseId)?.lock_code}</span></p>
                            </div>
                        ) : (
                           <div className="border-t pt-4">
                               <h3 className="text-sm font-semibold text-gray-500 mb-2">ОБЩАЯ СТАТИСТИКА</h3>
                               <PalletStats places={warehouses.flatMap(w => w.places || [])} items={items} />
                           </div>
                        )}
                </div>

                <div className="bg-gray-200 rounded-xl">
                    <div onClick={() => setIsPlacesSectionExpanded(p => !p)} className="flex justify-between items-center p-4 cursor-pointer group">
                        <h2 className="text-base font-bold text-gray-700 uppercase group-hover:text-blue-700">Места на складах</h2>
                        {isPlacesSectionExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </div>
                    {isPlacesSectionExpanded && (
                        <div className="p-2 md:p-4 space-y-4">
                            {warehousesToDisplay.map(warehouse => (
                                <WarehousePlacesBlock
                                    key={warehouse.id}
                                    warehouse={warehouse}
                                    items={items}
                                    itemTypes={itemTypes}
                                    isExpanded={expandedWarehouses.includes(warehouse.id)}
                                    onToggleExpand={() => toggleWarehouseExpansion(warehouse.id)}
                                    onPlaceSelect={(placeInfo) => setViewingPlaceInfo(placeInfo)}
                                    onEditPlaces={(warehouseId) => {
                                        setSelectedWarehouseId(warehouseId);
                                        setPlacesEditorOpen(true);
                                    }}
                                    userRole={userRole}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                     <button onClick={() => setScenariosModalOpen(true)} className="w-full flex items-center gap-2 p-4 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-md">
                        <ScenariosIcon />
                        <span className="flex-1 text-left">Задачи</span>
                        {notificationCount > 0 && (
                            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-red-100 bg-red-600 rounded-full">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setVerifyingItem({ id: 'any', name: 'любой товар' })} className="w-full flex items-center gap-2 p-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-md">
                        <TruckIcon />
                        <span className="flex-1 text-left">Переместить позицию по QR</span>
                    </button>
                    {(userRole === 'Администратор' || userRole === 'Сотрудник склада') && (
                        <button onClick={() => setItemEditorOpen(true)} className="w-full flex items-center gap-2 p-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md">
                            <PlusIcon />
                            <span className="flex-1 text-left">Создать позицию</span>
                        </button>
                    )}
                </div>
                
                {(userRole === 'Администратор' || userRole === 'Сотрудник склада' || userRole === 'Водитель') && (
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">СПИСОК ПОЗИЦИЙ НА СКЛАДЕ</h3>
                        <div className="flex flex-wrap gap-2 mb-4 border-b pb-4">
                            <button onClick={() => setActiveItemTypeFilter('all')} className={`px-3 py-1 text-sm font-semibold rounded-full ${activeItemTypeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Посмотреть все</button>
                            {itemTypes.map(type => (
                                <button key={type.id} onClick={() => setActiveItemTypeFilter(type.name)} className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${activeItemTypeFilter === type.name ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`} style={{backgroundColor: activeItemTypeFilter !== type.name ? '#e5e7eb' : type.color, color: activeItemTypeFilter !== type.name ? '#374151' : 'white'}}>
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'white'}}></div>
                                    {type.name}
                                </button>
                            ))}
                        </div>
                        {sortedAssignedFilteredItems.length > 0 ? (
                            <div className="space-y-3">
                                {sortedAssignedFilteredItems.map(item => {
                                    const itemType = itemTypes.find(it => it.name === item.type);
                                    const itemWarehouse = warehouses.find(w => w.id === item.warehouseId);
                                    const isUnplaced = item.placeId === null;
                                    const isLocked = lockedItemIds.has(item.id);

                                    return (
                                        <div 
                                            key={item.id} 
                                            onClick={() => isActionableUser && !isLocked && setItemToAction(item)}
                                            className={`${isUnplaced ? 'bg-red-50' : 'bg-gray-50'} p-3 rounded-lg flex items-start justify-between ${isActionableUser && !isLocked ? 'cursor-pointer hover:bg-gray-100 transition' : 'opacity-60'}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div style={{width: '30px', height: '30px', backgroundColor: itemType?.color || '#ccc', borderRadius: '4px', flexShrink: 0}}></div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Тип: {item.type} | Размер: {item.size} | Кол-во: {item.quantity}</p>
                                                    {isUnplaced ? (
                                                        <p className="text-sm text-red-600 mt-1">Склад: {itemWarehouse?.name} / Местоположение не задано</p>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 mt-1">Склад: {itemWarehouse?.name} / Место: #{item.placeId + 1}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button onClick={(e) => { e.stopPropagation(); setItemToPrint(item); }} className="text-gray-400 hover:text-blue-600 p-2"><PrintIcon/></button>
                                                {!isLocked && <button onClick={(e) => { e.stopPropagation(); setVerifyingItem(item); }} className="text-gray-400 hover:text-blue-600 p-2"><TruckIcon/></button>}
                                            </div>
                                        </div>
                                )})}
                            </div>
                        ) : (<div className="text-center text-gray-400 py-8">Позиций с выбранным типом нет</div>)}
                        
                        {sortedUnassignedFilteredItems.length > 0 && selectedWarehouseId === null && (
                            <div className="mt-6 pt-4 border-t">
                                <h3 className="text-sm font-semibold text-gray-500 mb-3">ПОЛНОСТЬЮ НЕРАСПРЕДЕЛЕННЫЕ</h3>
                                <div className="space-y-3">
                                    {sortedUnassignedFilteredItems.map(item => {
                                        const itemType = itemTypes.find(it => it.name === item.type);
                                        const isLocked = lockedItemIds.has(item.id);
                                        return (
                                        <div key={item.id} onClick={() => isActionableUser && !isLocked && setItemToAction(item)} className={`bg-red-50 p-3 rounded-lg flex items-start justify-between ${isActionableUser && !isLocked ? 'cursor-pointer hover:bg-red-100 transition' : 'opacity-60'}`}>
                                            <div className="flex items-start gap-3">
                                                <div style={{width: '30px', height: '30px', backgroundColor: itemType?.color || '#ccc', borderRadius: '4px', flexShrink: 0}}></div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Тип: {item.type} | Размер: {item.size} | Кол-во: {item.quantity}</p>
                                                    <p className="text-sm text-red-600 mt-1">Позиция не привязана к складу</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button onClick={(e) => { e.stopPropagation(); setItemToPrint(item); }} className="text-gray-400 hover:text-blue-600 p-2"><PrintIcon/></button>
                                                {!isLocked && <button onClick={(e) => { e.stopPropagation(); setVerifyingItem(item); }} className="text-gray-400 hover:text-blue-600 p-2"><TruckIcon/></button>}
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <div className="text-center py-10 bg-white rounded-xl shadow-md">
                <p className="text-gray-500 mb-4">Склады не найдены.</p>
                {userRole === 'Администратор' && (<button onClick={() => setEditingWarehouse({})} className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold transition"><PlusIcon /><span className="ml-2">Создать первый склад</span></button>)}
            </div>
        )}
      </div>
      
      {/* Модальные окна */}
      {isProfileEditorOpen && <ProfileEditorModal user={currentUser} warehouses={warehouses} onSave={handleUpdateUser} onClose={() => setProfileEditorOpen(false)} />}
      {isWarehouseListOpen && <WarehouseListModal userRole={userRole} warehouses={warehouses} selectedId={selectedWarehouseId} onSelect={handleSelectWarehouse} onEdit={handleStartEditWarehouse} onAdd={handleStartAddNewWarehouse} onDelete={handleDeleteWarehouse} onClose={() => setWarehouseListOpen(false)} />}
      {editingWarehouse && <WarehouseEditor initialData={editingWarehouse} onSave={handleSaveWarehouse} onCancel={() => setEditingWarehouse(null)} />}
      {isPlacesEditorOpen && warehouses.find(w => w.id === selectedWarehouseId) && <PlacesEditor initialPlaces={warehouses.find(w => w.id === selectedWarehouseId).places || []} onSave={handleSavePlaces} onCancel={() => setPlacesEditorOpen(false)} onReset={() => handleResetPlaces(selectedWarehouseId)} />}
      {isItemEditorOpen && <ItemEditor warehouses={warehouses} itemTypes={itemTypes} onSave={handleSaveItem} onCancel={() => setItemEditorOpen(false)} onManageTypes={() => setItemTypesManagerOpen(true)} items={items} userRole={userRole} />}
      {isItemTypesManagerOpen && <ItemTypesManager types={itemTypes} onSave={handleSaveItemTypes} onCancel={() => setItemTypesManagerOpen(false)} />}
      {viewingPlaceInfo && viewingPlace && <ItemsOnPlaceModal place={viewingPlace} items={itemsOnViewingPlace} itemTypes={itemTypes} onClose={() => setViewingPlaceInfo(null)} />}
      {isContactsModalOpen && <ContactsModal users={users} warehouses={warehouses} onClose={() => setContactsModalOpen(false)} />}
      {isUserModerationModalOpen && <UserModerationModal users={users} warehouses={warehouses} onSave={handleUpdateUser} onDelete={handleDeleteUser} onClose={() => setUserModerationModalOpen(false)} currentUser={currentUser} />}
      {movingItem && <ItemMoveModal itemToMove={movingItem} warehouses={warehouses} items={items} itemTypes={itemTypes} onSave={handleSaveItemMove} onCancel={() => setMovingItem(null)} />}
      {verifyingItem && <QRScannerModal itemToVerify={verifyingItem} allItems={items} onSuccess={handleVerificationSuccess} onCancel={() => setVerifyingItem(null)} />}
      
      {itemToAction && <ItemActionModal itemToAction={itemToAction} warehouses={warehouses} items={items} itemTypes={itemTypes} onMove={handleMoveItem} onWriteOff={handleWriteOffItem} onCancel={() => setItemToAction(null)} />}
      
      {itemToPrint && <QRCodePrintModal item={itemToPrint} user={currentUser} onClose={() => setItemToPrint(null)} />}

      {isScenariosModalOpen && <ScenariosModal 
            scenarios={scenarios} 
            warehouses={warehouses} 
            items={items} 
            users={users} 
            currentUser={currentUser} 
            onUpdateStatus={(scenario, newStatus) => setPendingAction({ scenario, newStatus })}
            onOpenCreate={() => { setScenariosModalOpen(false); setCreateScenarioModalOpen(true); }} 
            onDelete={handleDeleteScenario}
            onClose={() => setScenariosModalOpen(false)}
            onPrint={(scenario) => setScenarioToPrint(scenario)}
        />}
      {isCreateScenarioModalOpen && <CreateScenarioModal warehouses={warehouses} items={items} users={users} scenarios={scenarios} onCreate={handleCreateScenario} onClose={() => setCreateScenarioModalOpen(false)} />}
      
      {pendingAction && (
          <ActionConfirmationModal 
              title={pendingAction.newStatus === 'accepted' ? 'Подтверждение принятия' : 'Подтверждение завершения'}
              onConfirm={handleConfirmActionWithSignature}
              onCancel={() => setPendingAction(null)}
          />
      )}

      <div style={{ display: 'none' }}>
          {scenarioToPrint && (
              <ScenarioPrintDocument
                  ref={scenarioPrintRef}
                  scenario={scenarioToPrint}
                  warehouses={warehouses}
                  items={items}
                  users={users}
                  signatures={signatures}
              />
          )}
      </div>
    </div>
  );
}