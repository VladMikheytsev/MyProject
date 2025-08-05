import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode';
import SignatureCanvas from 'react-signature-canvas';
import moment from 'moment'; // Удалено, так как moment будет загружаться глобально
import 'moment/dist/locale/ru'; // Удалено, так как locale будет устанавливаться через глобальный moment

const moment = window.moment;
if (moment) {
    moment.locale('ru');
}


// --- Иконки (SVG) ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>;
const TrashIcon = ({ width = "24", height = "24" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const TruckIcon = ({ width = "24", height = "24" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
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
const JournalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const QrIcon = ({ color = "currentColor", width="18", height="18" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="14" y1="14" x2="14.01" y2="14"></line><line x1="21" y1="14" x2="21.01" y2="14"></line><line x1="14" y1="21" x2="14.01" y2="21"></line><line x1="21" y1="21" x2="21.01" y2="21"></line></svg>;
const SignatureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8.5"/><path d="m21.1 12.5-6.6 6.6"/><path d="M11 13h3a2 2 0 0 1 2 2v3"/><path d="m15 13 6 6"/><path d="M12.5 21.1 22 11.6"/></svg>;
const MapPinIcon = ({ width = "18", height = "18" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const RouteIcon = ({ width = "18", height = "18" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2L12 22"></path><path d="M20 16L12 22L4 16"></path><path d="M4 8L12 2L20 8"></path></svg>;
const Clock3Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const CarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h-2c-1.105 0-2 .895-2 2s.895 2 2 2h2c1.105 0 2-.895 2-2s-.895-2-2-2z"></path><path d="M5 17h-2c-1.105 0-2 .895-2 2s.895 2 2 2h2c1.105 0 2-.895 2-2s-.895-2-2-2z"></path><path d="M17 17h-11a3 3 0 0 1-3-3v-4h17v4a3 3 0 0 1-3 3z"></path><path d="M1 10h22"></path><path d="M17 10v-3a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v3"></path></svg>;

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

  fetchAppData: (userId) => api.request(`/data/${userId}`),
  saveAppData: (userId, data) => api.request(`/data/${userId}`, 'POST', data),
  fetchUsers: () => api.request('/users'),
  loginUser: (credentials) => api.request('/login', 'POST', credentials),
  registerUser: (userData) => api.request('/register', 'POST', userData),
  updateUser: (userData) => api.request(`/users/${userData.id}`, 'PUT', userData),
  deleteUser: (userId) => api.request(`/users/${userId}`, 'DELETE'),
  getRouteEta: (origin) => api.request('/get-route-eta', 'POST', { origin }),
};

// --- [НОВЫЙ КОМПОНЕНТ] RouteConfigurator ---
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
            connections: {}
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
        // Note: Replaced alert with custom modal for consistency in a real app
        // For this example, a simple alert is used as a placeholder
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


const PalletLines = ({ orientation = 'vertical' }) => {
    const longLineStyle = { position: 'absolute', backgroundColor: 'rgb(255, 249, 230)' };
    const transLineStyle = { position: 'absolute', backgroundColor: 'rgb(245, 191, 93)' };
    if (orientation === 'vertical') {
        const long1 = { ...longLineStyle, width: '2px', height: '100%', left: '3px', top: '0' };
        const long2 = { ...longLineStyle, width: '2px', height: '100%', left: '7px', top: '0' };
        const long3 = { ...longLineStyle, width: '2px', height: '100%', left: '11px', top: '0' };
        const long4 = { ...longLineStyle, width: '2px', height: '100%', left: '15px', top: '0' };
        const trans1 = { ...transLineStyle, height: '3px', width: '100%', top: '0', left: '0' };
        const trans2 = { ...transLineStyle, height: '3px', width: '100%', top: '50%', left: '0', transform: 'translateY(-50%)' };
        const trans3 = { ...transLineStyle, height: '3px', width: '100%', bottom: '0', left: '0' };
        return <><div style={long1}></div><div style={long2}></div><div style={long3}></div><div style={long4}></div><div style={trans1}></div><div style={trans2}></div><div style={trans3}></div></>;
    } else {
        const long1 = { ...longLineStyle, height: '2px', width: '100%', top: '3px', left: '0' };
        const long2 = { ...longLineStyle, height: '2px', width: '100%', top: '7px', left: '0' };
        const long3 = { ...longLineStyle, height: '2px', width: '100%', top: '11px', left: '0' };
        const long4 = { ...longLineStyle, height: '2px', width: '100%', top: '15px', left: '0' };
        const trans1 = { ...transLineStyle, width: '3px', height: '100%', left: '0', top: '0' };
        const trans2 = { ...transLineStyle, width: '3px', height: '100%', left: '50%', top: '0', transform: 'translateX(-50%)' };
        const trans3 = { ...transLineStyle, width: '3px', height: '100%', right: '0', top: '0' };
        return <><div style={long1}></div><div style={long2}></div><div style={long3}></div><div style={long4}></div><div style={trans1}></div><div style={trans2}></div><div style={trans3}></div></>;
    }
};
const ShelvingLines = ({ orientation = 'vertical' }) => {
    const lineStyle = { position: 'absolute', backgroundColor: 'rgb(20, 18, 16)' };
    if (orientation === 'vertical') {
        const style1 = { ...lineStyle, height: '2px', width: '100%', top: '0', left: '0' };
        const style2 = { ...lineStyle, height: '2px', width: '100%', bottom: '0', left: '0' };
        return <><div style={style1}></div><div style={style2}></div></>;
    } else {
        const style1 = { ...lineStyle, width: '2px', height: '100%', left: '0', top: '0' };
        const style2 = { ...lineStyle, width: '2px', height: '100%', right: '0', top: '0' };
        return <><div style={style1}></div><div style={style2}></div></>;
    }
};

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

// --- [НОВЫЙ КОМПОНЕНТ] Шкала заполненности паллетных мест ---
const PalletCapacityScale = ({ places = [], items = [] }) => {
    const palletPlaces = places.filter(p => p.type === 'pallet');
    const totalPalletPlaces = palletPlaces.length;

    if (totalPalletPlaces === 0) {
        return null;
    }

    const palletPlaceIds = new Set(palletPlaces.map(p => p.id));
    const occupiedPalletPlaceIds = new Set();
    items.forEach(item => {
        if (item.placeId !== null && palletPlaceIds.has(item.placeId)) {
            occupiedPalletPlaceIds.add(item.placeId);
        }
    });

    const occupiedCount = occupiedPalletPlaceIds.size;

    const dots = [];
    for (let i = 0; i < totalPalletPlaces; i++) {
        dots.push(
            <div
                key={i}
                style={{
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    backgroundColor: i < occupiedCount ? '#ef4444' : '#d1d5db', // red-500, gray-300
                    margin: '1px',
                }}
            ></div>
        );
    }

    return (
        <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Заполненность паллетных мест:</p>
            <div className="flex flex-wrap -m-px">{dots}</div>
        </div>
    );
};

// --- [НОВЫЙ КОМПОНЕНТ] Список свободных мест для всех складов ---
const AllWarehousesFreeSpace = ({ warehouses = [], items = [] }) => {
    const freeSpacesByWarehouse = warehouses
        .map(warehouse => {
            if (warehouse.id === 'all') return null;
            
            const palletPlaces = (warehouse.places || []).filter(p => p.type === 'pallet');
            const totalPalletPlaces = palletPlaces.length;

            if (totalPalletPlaces === 0) {
                return null;
            }

            const palletPlaceIds = new Set(palletPlaces.map(p => p.id));
            const occupiedPalletPlaceIds = new Set();
            items.forEach(item => {
                if (item.warehouseId === warehouse.id && item.placeId !== null && palletPlaceIds.has(item.placeId)) {
                    occupiedPalletPlaceIds.add(item.placeId);
                }
            });
            
            const occupiedCount = occupiedPalletPlaceIds.size;
            const freeCount = totalPalletPlaces - occupiedCount;

            return {
                id: warehouse.id,
                name: warehouse.name,
                free: freeCount
            };
        })
        .filter(Boolean);

    if (freeSpacesByWarehouse.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Свободные места</h4>
            <div className="space-y-1 text-sm">
                {freeSpacesByWarehouse.map(w => (
                    <div key={w.id} className="flex justify-between">
                        <span className="text-gray-600">{w.name}:</span>
                        <span className="font-bold text-gray-800">{w.free}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LabelsToPrint = React.forwardRef(({ item, user, qrCodeUrl }, ref) => {
    const getLabelCount = () => {
        if (item.size === 'Паллета') {
            return 2;
        }
        if (item.size === 'Коробка') {
            return (item.quantity || 1) * 2;
        }
        return 1; // Default for other types
    };

    const labelCount = getLabelCount();
    const printTime = new Date();

    const formatCode = (code) => {
        if (!code || code.length !== 8) return '';
        return `${code.substring(0, 4)} ${code.substring(4, 8)}`;
    };

    return (
        <div ref={ref}>
            <style type="text/css" media="print">
                {`
                    @page {
                        size: 6in 4in landscape;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .label-container {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        font-family: sans-serif;
                        text-align: center;
                        gap: 8px;
                        box-sizing: border-box;
                        padding: 0.2in;
                        page-break-after: always;
                    }
                    .label-name {
                        font-size: 24pt;
                        font-weight: bold;
                        margin: 0;
                    }
                    .label-type {
                        font-size: 16pt;
                        margin: 0;
                    }
                    .label-qr {
                        width: 1.5in;
                        height: 1.5in;
                        margin-top: 8px;
                        margin-bottom: 4px;
                    }
                    .label-unique-code {
                        font-family: monospace;
                        font-size: 20pt;
                        letter-spacing: 0.1em;
                        font-weight: bold;
                        margin: 0;
                    }
                    .label-datetime, .label-user {
                        font-size: 10pt;
                        margin: 0;
                    }
                `}
            </style>
            {Array.from({ length: labelCount }).map((_, i) => (
                 <div key={i} className="label-container">
                    <h2 className="label-name">{item.name}</h2>
                    <p className="label-type">{item.type}</p>
                    {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="label-qr" />}
                    <p className="label-unique-code">{formatCode(item.uniqueCode)}</p>
                    <p className="label-datetime">
                        {printTime.toLocaleDateString('ru-RU')} &nbsp; {printTime.toLocaleTimeString('ru-RU')}
                    </p>
                    <p className="label-user">
                        {user.firstName} {user.lastName}
                    </p>
                </div>
            ))}
        </div>
    );
});


const QRCodePrintModal = ({ item, user, onClose }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const qrCodePreviewRef = useRef();
    const printComponentRef = useRef();
    const titleRef = useRef(null);

    // const handlePrint = useReactToPrint({
    //     content: () => printComponentRef.current,
    //     documentTitle: `Labels-${item.name}`,
    // });
    
    useEffect(() => {
        const generateQr = async () => {
            const qrString = item.id;
            try {
                // const url = await QRCode.toDataURL(qrString, {
                //     width: 256,
                //     margin: 2,
                // });
                // setQrCodeUrl(url);
                // Placeholder for QRCode generation
                setQrCodeUrl('https://placehold.co/256x256/E5E7EB/A1A1AA?text=QR+Code+Placeholder');
            } catch (err) {
                console.error('Не удалось сгенерировать QR-код:', err);
            }
        };
        generateQr();
    }, [item]);

    useLayoutEffect(() => {
        const element = titleRef.current;
        if (!element || !qrCodeUrl) return;

        const MAX_WIDTH = 256; 
        const MIN_FONT_SIZE = 12;
        const START_FONT_SIZE = 60;

        let currentFontSize = START_FONT_SIZE;
        element.style.fontSize = `${currentFontSize}px`;
        element.style.wordWrap = 'break-word';

        const isTooTall = () => element.scrollHeight > currentFontSize * 2.4;
        
        while ((element.scrollWidth > MAX_WIDTH || isTooTall()) && currentFontSize > MIN_FONT_SIZE) {
            currentFontSize--;
            element.style.fontSize = `${currentFontSize}px`;
        }

    }, [item.name, qrCodeUrl]);
    
    const handlePrint = () => {
        alert('Функция печати не поддерживается в этом окружении.');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up">
                <div ref={qrCodePreviewRef} className="text-center p-4 flex flex-col items-center">
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
                    {item.uniqueCode && (
                        <p className="font-mono text-2xl text-gray-800 mt-4 tracking-widest">
                            {item.uniqueCode.substring(0, 4)} {item.uniqueCode.substring(4, 8)}
                        </p>
                    )}
                    <div className="text-xs text-gray-500 mt-4">
                        <p>Дата печати: {new Date().toLocaleString('ru-RU')}</p>
                        <p>Пользователь: {user.firstName} {user.lastName}</p>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Закрыть</button>
                    <button onClick={handlePrint} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold flex items-center gap-2">
                        <PrintIcon /> Печать
                    </button>
                </div>

                <div style={{ display: 'none' }}>
                    <LabelsToPrint ref={printComponentRef} item={item} user={user} qrCodeUrl={qrCodeUrl} />
                </div>
            </div>
        </div>
    );
};


// --- Модальные окна ---

const ProfileEditorModal = ({ user, warehouses, onSave, onClose, onLogout }) => {
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
                <div className="flex justify-between items-center mt-8">
                    <button onClick={onLogout} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 font-semibold transition">
                        <LogOutIcon />
                        <span>Выйти</span>
                    </button>
                    <div className="flex space-x-4">
                        <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
                        <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить</button>
                    </div>
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
        <div className="flex flex-col p-1" style={{ width: 'fit-content', backgroundColor: '#f9fafb', borderTop: '3px solid black', borderLeft: '3px solid black', borderRight: '3px solid black' }}>
            {sortedActiveRows.map(row => (
                <div key={row} className="flex">
                    {sortedActiveCols.map(col => {
                        const id = row * 7 + col;
                        const place = places.find(p => p.id === id);
                        let style = { width: '20px', height: '24px', position: 'relative', overflow: 'hidden' };
                        let backgroundColor = 'transparent';
                        let isDisabled = disabledPlaces.includes(id);
                        let isSelected = selectedPlaceInfo?.placeId === id && selectedPlaceInfo?.warehouseId === warehouseId;
                        let itemsOnThisPlace = [];
                        let isClickable = false;

                        if (place) {
                            itemsOnThisPlace = items.filter(item => item.placeId === id);
                            isClickable = onPlaceSelect && !isDisabled;
                            if (!onPlaceSelect) {
                                isClickable = itemsOnThisPlace.length > 0;
                            }

                            if (place.type === 'pallet') {
                                backgroundColor = 'rgb(245, 192, 93)';
                                style.width = place.orientation === '30*36' ? '20px' : '24px';
                                style.height = place.orientation === '30*36' ? '24px' : '20px';
                            } else if (place.type === 'shelving') {
                                backgroundColor = 'rgb(84, 73, 61)';
                                style.width = place.orientation === '40*15' ? '27px' : '10px';
                                style.height = place.orientation === '40*15' ? '10px' : '27px';
                            }
                        }
                        
                        const margin = '1.5px';

                        return (
                            <div key={col} className="flex items-center justify-center" style={{ width: '30px', height: '30px', margin: margin }}>
                                <div onClick={() => isClickable && onPlaceSelect({placeId: id, warehouseId: warehouseId})} className={`rounded-sm flex items-center justify-center gap-1 ${isClickable ? 'cursor-pointer' : ''} ${isDisabled ? 'opacity-30' : ''} ${isSelected ? 'ring-2 ring-offset-1 ring-red-500' : ''}`} style={{...style, backgroundColor}}>
                                  {place && place.type === 'pallet' && itemsOnThisPlace.length === 0 && <PalletLines orientation={place.orientation === '30*36' ? 'vertical' : 'horizontal'} />}
                                  {place && place.type === 'shelving' && <ShelvingLines orientation={place.orientation === '15*40' ? 'vertical' : 'horizontal'} />}
                                  {place && place.type === 'pallet' && itemsOnThisPlace.map(item => {
                                      const itemType = itemTypes.find(it => it.name === item.type);
                                      return <div key={item.id} style={{ width: '16px', height: '16px', backgroundColor: itemType?.color || '#ccc', flexShrink: 0 }} className="rounded-sm"></div>
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
                                    style={{
                                        backgroundColor: newItem.type === t.name ? t.color : '#e5e7eb', 
                                        color: newItem.type === t.name ? 'white' : '#374151',
                                        borderColor: t.color
                                    }}
                                >
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'white', opacity: newItem.type === t.name ? 1 : 0.5}}></div>
                                    {t.name}
                                </button>
                            ))}
                        </div>
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

const ItemEditModal = ({ itemToEdit, itemTypes, onSave, onCancel }) => {
    const [editedItem, setEditedItem] = useState({ ...itemToEdit });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const processedValue = name === 'quantity' ? parseInt(value, 10) || 0 : value;
        setEditedItem(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSave = () => {
        if (!editedItem.name || !editedItem.type || !editedItem.size || editedItem.quantity <= 0) {
            alert('Пожалуйста, заполните все поля корректно.');
            return;
        }
        onSave(editedItem);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Редактировать позицию</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Наименование:</label>
                        <input
                            type="text"
                            name="name"
                            value={editedItem.name}
                            onChange={handleChange}
                            placeholder="Наименование"
                            className="w-full p-3 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Тип позиции:</label>
                        <select
                            name="type"
                            value={editedItem.type}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white"
                        >
                            {itemTypes.map(t => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Размер:</label>
                            <select
                                name="size"
                                value={editedItem.size}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg bg-white"
                            >
                                <option>Паллета</option>
                                <option>Коробка</option>
                                <option>Шт</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Количество:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={editedItem.quantity}
                                onChange={handleChange}
                                placeholder="Количество"
                                min="1"
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить изменения</button>
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
    const formatCode = (code) => {
        if (!code || code.length !== 8) return '';
        return `${code.substring(0, 4)} ${code.substring(4, 8)}`;
    };
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
                                    <p className="text-xs font-mono text-gray-400 tracking-widest">{formatCode(item.uniqueCode)}</p>
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

const ContactsModal = ({ users, warehouses, onClose, onOpenModeration, userRole }) => {
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
                
                {userRole === 'Администратор' && (
                    <button 
                        onClick={onOpenModeration} 
                        className="w-full flex items-center justify-center gap-2 p-3 mb-4 rounded-xl bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition"
                    >
                        <UsersIcon /> Модерация пользователей
                    </button>
                )}

                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
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

// --- [НОВЫЙ КОМПОНЕНТ] DriverSettingsModal
const DriverSettingsModal = ({ drivers, onSaveDriver, onClose }) => {
  const [expandedDriverId, setExpandedDriverId] = useState(null);
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  // const now = moment();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(moment(now));
  const [selectedDayForNonWork, setSelectedDayForNonWork] = useState(null);
  const [nonWorkTimes, setNonWorkTimes] = useState({});

  useEffect(() => {
    // Reset nonWorkTimes when a new driver is expanded
    if (expandedDriverId) {
      const driver = drivers.find(d => d.id === expandedDriverId);
      if (driver && driver.workSchedule && driver.workSchedule.nonWorkingHours) {
        setNonWorkTimes(driver.workSchedule.nonWorkingHours);
      } else {
        setNonWorkTimes({});
      }
    }
  }, [expandedDriverId, drivers]);


  const handleCarChange = (driverId, field, value) => {
    const driverToUpdate = drivers.find(d => d.id === driverId);
    if (!driverToUpdate) return;
    const updatedCar = { ...driverToUpdate.car, [field]: value };
    onSaveDriver({ ...driverToUpdate, car: updatedCar });
  };
  
  const handleWorkScheduleChange = (driverId, day) => {
    const driverToUpdate = drivers.find(d => d.id === driverId);
    if (!driverToUpdate) return;
    const currentSchedule = driverToUpdate.workSchedule || { workingDays: [], nonWorkingHours: {} };
    const newWorkingDays = currentSchedule.workingDays.includes(day)
        ? currentSchedule.workingDays.filter(d => d !== day)
        : [...currentSchedule.workingDays, day];
    onSaveDriver({ ...driverToUpdate, workSchedule: { ...currentSchedule, workingDays: newWorkingDays } });
  };

  const handleAddNonWorkTime = (driverId, date) => {
      const start = prompt("Введите начало нерабочего времени (например, 09:00):");
      const end = prompt("Введите конец нерабочего времени (например, 11:30):");
      if (start && end) {
        const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
        if (!timeRegex.test(start) || !timeRegex.test(end)) {
            alert('Неверный формат времени. Используйте ЧЧ:ММ.');
            return;
        }

        const newNonWorkingHours = { ...nonWorkTimes[date] || {}, [start]: end };
        
        const driverToUpdate = drivers.find(d => d.id === driverId);
        if (!driverToUpdate) return;

        const currentSchedule = driverToUpdate.workSchedule || { workingDays: [], nonWorkingHours: {} };
        const updatedNonWorkingHours = { ...currentSchedule.nonWorkingHours, [date]: newNonWorkingHours };
        
        onSaveDriver({ ...driverToUpdate, workSchedule: { ...currentSchedule, nonWorkingHours: updatedNonWorkingHours }});
        setNonWorkTimes(updatedNonWorkingHours); // Update local state for immediate re-render
      }
  };

  const handleRemoveNonWorkTime = (driverId, date, startTime) => {
    if (window.confirm("Вы уверены, что хотите удалить этот интервал?")) {
      const driverToUpdate = drivers.find(d => d.id === driverId);
      if (!driverToUpdate) return;

      const currentSchedule = driverToUpdate.workSchedule || { workingDays: [], nonWorkingHours: {} };
      const updatedNonWorkingHoursForDay = { ...currentSchedule.nonWorkingHours[date] };
      delete updatedNonWorkingHoursForDay[startTime];
      
      const newNonWorkingHours = { ...currentSchedule.nonWorkingHours, [date]: updatedNonWorkingHoursForDay };
      if (Object.keys(updatedNonWorkingHoursForDay).length === 0) {
          delete newNonWorkingHours[date];
      }

      onSaveDriver({ ...driverToUpdate, workSchedule: { ...currentSchedule, nonWorkingHours: newNonWorkingHours }});
      setNonWorkTimes(newNonWorkingHours); // Update local state
    }
  };


  const getDaysInMonth = (month) => {
    const startOfMonth = month.clone().startOf('month').startOf('week');
    const endOfMonth = month.clone().endOf('month').endOf('week');
    const days = [];
    let day = startOfMonth.clone();
    while (day.isSameOrBefore(endOfMonth)) {
        days.push(day.clone());
        day.add(1, 'day');
    }
    return days;
  };

  const getCalendarDays = (month, workingDays, nonWorkingHours) => {
    const days = getDaysInMonth(month);
    return days.map(day => {
        const dayOfWeek = day.format('dd');
        const isWorkingDay = workingDays.includes(dayOfWeek);
        const nonWorkPeriods = nonWorkingHours[day.format('YYYY-MM-DD')] || {};
        return {
            date: day,
            isCurrentMonth: day.isSame(month, 'month'),
            isWorkingDay,
            nonWorkPeriods: Object.keys(nonWorkPeriods).length > 0 ? nonWorkPeriods : null,
        };
    });
  };


  const navigateMonth = (direction) => {
      setCurrentMonth(prev => prev.clone().add(direction, 'month'));
  };

  const getCalendar = (driverId, driver) => {
    const workingDays = driver.workSchedule?.workingDays || [];
    const nonWorkingHours = driver.workSchedule?.nonWorkingHours || {};
    const calendarDays = getCalendarDays(currentMonth, workingDays, nonWorkingHours);

    const getFreeHours = (day) => {
        const today = day.date.format('YYYY-MM-DD');
        const nonWorking = nonWorkTimes[today] || {};
        const nonWorkingPeriods = Object.entries(nonWorking).map(([start, end]) => ({
            start: moment(start, 'HH:mm'),
            end: moment(end, 'HH:mm')
        })).sort((a,b) => a.start.unix() - b.start.unix());

        const totalFreeMinutes = 12 * 60; // 7am to 7pm is 12 hours
        let occupiedMinutes = 0;
        nonWorkingPeriods.forEach(period => {
            occupiedMinutes += moment.duration(period.end.diff(period.start)).asMinutes();
        });
        const freeHours = Math.max(0, totalFreeMinutes - occupiedMinutes) / 60;
        return freeHours.toFixed(1);
    };

    return (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
             <h4 className="font-bold mb-2">Рабочее время</h4>
             <div className="flex justify-between items-center mb-4">
                 <button onClick={() => navigateMonth(-1)} className="p-2"><ArrowLeftIcon /></button>
                 <span className="font-semibold">{currentMonth.format('MMMM YYYY')}</span>
                 <button onClick={() => navigateMonth(1)} className="p-2"><ArrowRightIcon /></button>
             </div>
             <div className="grid grid-cols-7 text-center font-bold text-gray-500 mb-2 text-xs">
                 {daysOfWeek.map(day => <span key={day}>{day}</span>)}
             </div>
             <div className="grid grid-cols-7 gap-2">
                 {calendarDays.map((day, index) => {
                     const dateString = day.date.format('YYYY-MM-DD');
                     const isSelected = selectedDayForNonWork === dateString;
                     const nonWorkPeriods = nonWorkTimes[dateString] || {};
                     const hasNonWork = Object.keys(nonWorkPeriods).length > 0;
                     const isWorking = day.isWorkingDay;

                     return (
                         <div
                             key={index}
                             onClick={() => isWorking && setSelectedDayForNonWork(isSelected ? null : dateString)}
                             className={`p-1.5 rounded-lg text-sm text-center cursor-pointer relative
                                ${!day.isCurrentMonth ? 'opacity-40' : ''}
                                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                                ${isWorking ? 'bg-white hover:bg-gray-100' : 'bg-gray-200'}
                             `}
                         >
                            <span className={`block font-semibold ${isWorking ? 'text-gray-800' : 'text-gray-400'}`}>{day.date.date()}</span>
                            {isWorking && <span className="block text-xs text-green-600 font-semibold mt-1">{getFreeHours(day)} ч.</span>}
                            {hasNonWork && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></div>}
                         </div>
                     );
                 })}
             </div>
             {selectedDayForNonWork && (
                <div className="mt-4 p-4 border rounded-lg bg-white">
                    <div className="flex justify-between items-center mb-3">
                        <h5 className="font-bold">Нерабочее время на {moment(selectedDayForNonWork).format('L')}</h5>
                        <button onClick={() => handleAddNonWorkTime(driverId, selectedDayForNonWork)} className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center gap-1 text-sm"><PlusIcon width="16" height="16" /> Добавить</button>
                    </div>
                    <div className="space-y-2">
                         {Object.entries(nonWorkTimes[selectedDayForNonWork] || {}).length > 0 ? (
                            Object.entries(nonWorkTimes[selectedDayForNonWork]).map(([start, end]) => (
                                <div key={start} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                                    <span>{start} - {end}</span>
                                    <button onClick={() => handleRemoveNonWorkTime(driverId, selectedDayForNonWork, start)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon width="16" height="16" /></button>
                                </div>
                            ))
                         ) : (
                             <p className="text-sm text-gray-500 text-center">Нерабочего времени нет</p>
                         )}
                    </div>
                </div>
             )}
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Настройка водителей</h2>
                <button onClick={onClose} className="p-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300"><XIcon /></button>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {drivers.length > 0 ? drivers.map(driver => (
                    <div key={driver.id} className="bg-gray-50 rounded-lg shadow-sm border">
                        <div 
                            className="p-4 cursor-pointer flex justify-between items-center"
                            onClick={() => {
                                setExpandedDriverId(expandedDriverId === driver.id ? null : driver.id);
                                setSelectedDayForNonWork(null);
                            }}
                        >
                            <h4 className="font-bold text-lg text-gray-800">{driver.firstName} {driver.lastName}</h4>
                            {expandedDriverId === driver.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </div>
                        {expandedDriverId === driver.id && (
                            <div className="p-4 border-t animate-fade-in-up space-y-6">
                                {/* --- Блок: Машина --- */}
                                <div>
                                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CarIcon /> Машина</h4>
                                    <div className="space-y-3">
                                        <input 
                                            type="text" 
                                            placeholder="Номерной знак" 
                                            value={driver.car?.plateNumber || ''} 
                                            onChange={e => handleCarChange(driver.id, 'plateNumber', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Макс. Грузоподъемность (кг)" 
                                            value={driver.car?.capacity || ''} 
                                            onChange={e => handleCarChange(driver.id, 'capacity', parseInt(e.target.value) || 0)}
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Макс. паллет" 
                                            value={driver.car?.maxPallets || ''} 
                                            onChange={e => handleCarChange(driver.id, 'maxPallets', parseInt(e.target.value) || 0)}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                </div>
                                {/* --- Блок: График работы --- */}
                                <div>
                                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Clock3Icon /> График работы</h4>
                                    <div className="flex justify-between items-center">
                                        {daysOfWeek.map((day) => (
                                            <button
                                                key={day}
                                                onClick={() => handleWorkScheduleChange(driver.id, day)}
                                                className={`w-10 h-10 rounded-full font-bold text-sm transition-colors
                                                    ${driver.workSchedule?.workingDays?.includes(day) 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* --- Блок: Рабочее время (Календарь) --- */}
                                <div>
                                     <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CalendarIcon /> Рабочее время</h4>
                                     {getCalendar(driver.id, driver)}
                                </div>
                            </div>
                        )}
                    </div>
                )) : <p className="text-center text-gray-500 py-8">Нет доступных водителей.</p>}
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

const ItemActionModal = ({ itemToAction, warehouses, items, itemTypes, onMove, onWriteOff, onCancel }) => {
    const [moveQuantity, setMoveQuantity] = useState(itemToAction.quantity);
    const [unit, setUnit] = useState(itemToAction.size);
    const [destination, setDestination] = useState({
        warehouseId: itemToAction.warehouseId !== 'unassigned' ? itemToAction.warehouseId : warehouses[0]?.id,
        placeId: null
    });
    const [disabledPlaces, setDisabledPlaces] = useState([]);
    const quantityInputRef = useRef(null);

    const formatCode = (code) => {
        if (!code || code.length !== 8) return '';
        return `${code.substring(0, 4)} ${code.substring(4, 8)}`;
    };

    useEffect(() => {
        const selectedWarehouse = warehouses.find(w => w.id === destination.warehouseId);
        if (!selectedWarehouse) return;

        const otherItems = items.filter(i => i.id !== itemToAction.id);
        const newDisabledPlaces = [];
        (selectedWarehouse.places || []).forEach(place => {
            const itemsOnPlace = otherItems.filter(i => i.placeId === place.id && i.warehouseId === destination.warehouseId);
            // Logic to disable places based on the item being moved
            if (unit === 'Паллета') {
                if (place.type === 'shelving') {
                    newDisabledPlaces.push(place.id);
                }
                if (place.type === 'pallet' && itemsOnPlace.filter(i => i.size === 'Паллета').length >= 2) {
                    newDisabledPlaces.push(place.id);
                }
            }
        });
        setDisabledPlaces(newDisabledPlaces);
        // Reset place selection if warehouse changes
        if (destination.warehouseId !== itemToAction.warehouseId) {
             setDestination(prev => ({...prev, placeId: null}));
        }
    }, [destination.warehouseId, unit, itemToAction, warehouses, items]);

    const handleMove = () => {
        const quantity = parseInt(moveQuantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            alert('Пожалуйста, введите корректное количество.');
            return;
        }
        if (quantity > itemToAction.quantity) {
            alert(`Нельзя переместить больше, чем есть в наличии (${itemToAction.quantity}).`);
            return;
        }
        if (destination.placeId === null) {
            alert('Пожалуйста, выберите новое место.');
            return;
        }
        onMove({ destination, quantity, unit });
    };

    const handleWarehouseChange = (e) => {
        const newWarehouseId = e.target.value;
        setDestination({ warehouseId: newWarehouseId, placeId: null });
    };

    const handlePlaceSelect = (placeInfo) => {
        setDestination(prev => ({ ...prev, placeId: placeInfo.placeId }));
    };
    
    const handleWriteOffClick = () => {
        onWriteOff(itemToAction);
    }

    const selectedWarehouse = warehouses.find(w => w.id === destination.warehouseId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Перемещение / Списание</h2>
                <p className="font-mono text-sm text-gray-400 tracking-widest">{formatCode(itemToAction.uniqueCode)}</p>
                <p className="mb-6 text-gray-600">"{itemToAction.name}" (Доступно: {itemToAction.quantity})</p>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Количество:</label>
                            <input
                                ref={quantityInputRef}
                                type="number"
                                value={moveQuantity}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setMoveQuantity(e.target.value)}
                                placeholder="Количество"
                                min="1"
                                max={itemToAction.quantity}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Тип места:</label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full p-3 border rounded-lg bg-white"
                            >
                                <option>Паллета</option>
                                <option>Коробка</option>
                                <option>Шт</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Целевой склад:</label>
                        <select value={destination.warehouseId || ''} onChange={handleWarehouseChange} className="w-full p-3 border rounded-lg bg-white">
                            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                    </div>

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
                
                <div className="flex justify-center items-center gap-x-6 mt-8 w-full border-t pt-6">
                    <button 
                        onClick={onCancel} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        aria-label="Отмена"
                    >
                        <XIcon />
                    </button>

                    <button 
                        onClick={handleWriteOffClick} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-red-500 hover:bg-red-600 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                        aria-label="Списать"
                    >
                        <TrashIcon />
                    </button>
                    
                    <button 
                        onClick={handleMove} 
                        disabled={destination.placeId === null} 
                        className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-blue-600 hover:bg-blue-700 font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:shadow-none"
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
    const [scanStatus, setScanStatus] = useState('idle');
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
                        ? 'Нажмите кнопку, чтобы отсканировать QR-код любой позиции для выполнения действия.'
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
    const signatureContainerRef = useRef(null);
    const [signatureCanvasSize, setSignatureCanvasSize] = useState({ width: 0, height: 192 });

    useLayoutEffect(() => {
        const updateSize = () => {
            if (signatureContainerRef.current) {
                setSignatureCanvasSize({
                    width: signatureContainerRef.current.offsetWidth,
                    height: 192
                });
            }
        };
        
        if (step === 3) {
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }
    }, [step]);

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
            // Note: Replaced alert with custom modal for consistency in a real app
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
        // if (signatureRef.current.isEmpty()) {
        //     alert('Пожалуйста, поставьте свою подпись.');
        //     return;
        // }
        // const signatureData = signatureRef.current.toDataURL();
        const signatureData = 'placeholder-signature-data';
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
                        <div ref={signatureContainerRef} className="bg-gray-100 rounded-lg border-2 border-dashed w-full h-48">
                             {/* <SignatureCanvas 
                                ref={signatureRef} 
                                canvasProps={{ 
                                    width: signatureCanvasSize.width, 
                                    height: signatureCanvasSize.height, 
                                    className: 'block' 
                                }} 
                             /> */}
                             <p className="text-center text-sm text-gray-500 py-16">
                                 Функция подписи недоступна без внешней библиотеки.
                             </p>
                        </div>
                         <div className="flex justify-center gap-4 mt-4">
                             {/* <button onClick={() => signatureRef.current.clear()} className="text-sm font-semibold text-gray-600 hover:text-black">Очистить</button> */}
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
            alert('Имя пользователя и пароль обязательны.');
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
            alert('Все поля обязательны для заполнения.');
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

const WarehouseInfoBlock = ({ warehouse, onEdit, userRole, isExpanded, onToggleExpansion }) => {
    return (
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col">
            <div className="flex justify-between items-start">
                <div 
                    className="flex-grow cursor-pointer" 
                    onClick={() => onToggleExpansion(warehouse.id)}
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">{warehouse.name}</h3>
                        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </div>
                    <p className="text-sm text-gray-500">{warehouse.address}</p>
                </div>
                {userRole === 'Администратор' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(warehouse);
                        }}
                        className="text-gray-400 hover:text-blue-600 transition p-1 z-10 ml-2"
                        aria-label={`Редактировать склад ${warehouse.name}`}
                    >
                        <EditIcon />
                    </button>
                )}
            </div>
             {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in-up">
                    <p className="text-sm text-gray-600">{warehouse.hours}</p>
                    <p className="text-sm text-gray-600 mt-1">Ворота: <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded">{warehouse.gate_code}</span></p>
                    <p className="text-sm text-gray-600">Замок: <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded">{warehouse.lock_code}</span></p>
                </div>
             )}
        </div>
    );
};

const WarehousePlacesBlock = ({ warehouse, items, itemTypes, onPlaceSelect, onEditPlaces, userRole }) => {
    const warehouseItems = items.filter(i => i.warehouseId === warehouse.id);
    return (
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col relative">
            <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold text-gray-800">{warehouse.name}</h3>
                 {userRole === 'Администратор' && (
                    <button
                        onClick={() => onEditPlaces(warehouse.id)}
                        className="text-gray-400 hover:text-blue-600 transition p-1 z-10"
                        aria-label={`Редактировать места на складе ${warehouse.name}`}
                    >
                        <EditIcon />
                    </button>
                )}
            </div>
            <div className="mb-4 border-b pb-2">
                <PalletStats places={warehouse.places || []} items={warehouseItems} />
                {/* [ИЗМЕНЕНИЕ] Добавлена шкала заполненности */}
                <PalletCapacityScale places={warehouse.places || []} items={warehouseItems} />
            </div>
            <div className="flex-grow overflow-auto">
                {(warehouse.places && warehouse.places.length > 0) ? (
                    <div className="flex justify-center">
                         <CompactPlacesGrid
                            places={warehouse.places}
                            items={warehouseItems}
                            itemTypes={itemTypes}
                            onPlaceSelect={onPlaceSelect}
                            warehouseId={warehouse.id}
                        />
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-8">
                        <span>Места не сконфигурированы.</span>
                    </div>
                )}
            </div>
        </div>
    );
};


const ScenarioPrintDocument = React.forwardRef(({ scenario, warehouses, items, users, signatures }, ref) => {
    const getUserNameById = (userId) => {
        if (!userId) return '';
        const user = users.find(u => u.id === userId);
        return user ? `${user.firstName} ${user.lastName.charAt(0)}.` : 'Неизвестно';
    };

    const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || 'Неизвестно';
    const getFullItemDetails = (itemId) => items.find(i => i.id === itemId);
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    // Стили для выравнивания подписей
    const signatureLineStyle = {
        display: 'flex',
        alignItems: 'flex-end',
        borderBottom: '1px solid #333',
        paddingBottom: '4px',
        marginBottom: '1.5em',
        minHeight: '48px'
    };

    const signatureLabelStyle = {
        width: '130px',
        flexShrink: 0
    };
    
    // This is the container for the right side elements
    const signatureGroupStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        marginLeft: 'auto',
        paddingRight: '1cm',
        // 1cm padding + 50px for image
        paddingLeft: 'calc(1cm + 50px)', 
    };
    
    // The signature image itself
    const signatureImageStyle = {
        position: 'absolute',
        left: '1cm', // Position it inside the left padding
        bottom: '0px',
        height: '48px',
        transform: 'translateY(-10%)',
        opacity: 0.8,
        pointerEvents: 'none'
    };

    const nameStyle = {
        marginRight: '1em' // Space between name and date
    };


    return (
        <div ref={ref} style={{ 
            padding: '2cm', 
            fontFamily: 'sans-serif', 
            position: 'relative', 
            minHeight: '25cm' 
        }}>
            <header style={{ textAlign: 'left', marginBottom: '40px' }}>
                <p><strong>Company:</strong> Diva Fam Inc.</p>
                <p><strong>Document number:</strong> {scenario.number}</p>
                <p><strong>Transfer date:</strong> {new Date(scenario.createdAt).toLocaleDateString('ru-RU')}</p>
                <p><strong>From Warehouse:</strong> {getWarehouseName(scenario.fromWarehouseId)}</p>
                <p><strong>To Warehouse:</strong> {getWarehouseName(scenario.toWarehouseId)}</p>
            </header>

            <main style={{ flexGrow: 1, paddingBottom: '150px' }}>
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
            
            <footer style={{
                position: 'absolute',
                bottom: '2cm',
                left: '2cm',
                right: '2cm',
                fontSize: '14px'
            }}>
                <div style={signatureLineStyle}>
                    <span style={signatureLabelStyle}><strong>Transferred by:</strong></span>
                    <div style={signatureGroupStyle}>
                        {signatures[scenario.creatorSignatureId] && 
                            <img src={signatures[scenario.creatorSignatureId]} alt="signature" style={signatureImageStyle} />}
                        <span style={nameStyle}>{getUserNameById(scenario.creatorId)}</span>
                        <span>{currentDate}</span>
                    </div>
                </div>
                <div style={signatureLineStyle}>
                    <span style={signatureLabelStyle}><strong>Driver:</strong></span>
                    <div style={signatureGroupStyle}>
                        {signatures[scenario.driverSignatureId] && 
                            <img src={signatures[scenario.driverSignatureId]} alt="signature" style={signatureImageStyle} />}
                        <span style={nameStyle}>{getUserNameById(scenario.driverId)}</span>
                        <span>{currentDate}</span>
                    </div>
                </div>
                <div style={{...signatureLineStyle, marginBottom: 0 }}>
                    <span style={signatureLabelStyle}><strong>Received by:</strong></span>
                    <div style={signatureGroupStyle}>
                        {signatures[scenario.completerSignatureId] && 
                            <img src={signatures[scenario.completerSignatureId]} alt="signature" style={signatureImageStyle} />}
                        <span style={nameStyle}>{getUserNameById(scenario.completerId)}</span>
                        <span>{currentDate}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
});

const ActionConfirmationModal = ({ title, onConfirm, onCancel }) => {
    const signatureRef = useRef(null);
    const signatureContainerRef = useRef(null);
    const [signatureCanvasSize, setSignatureCanvasSize] = useState({ width: 0, height: 192 });

    useLayoutEffect(() => {
        const updateSize = () => {
            if (signatureContainerRef.current) {
                setSignatureCanvasSize({
                    width: signatureContainerRef.current.offsetWidth,
                    height: 192
                });
            }
        };
        
        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const handleConfirm = () => {
        // if (signatureRef.current.isEmpty()) {
        //     alert('Пожалуйста, поставьте подпись для подтверждения.');
        //     return;
        // }
        // const signatureData = signatureRef.current.toDataURL();
        const signatureData = 'placeholder-signature-data';
        onConfirm(signatureData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up my-auto">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-600 mb-4">Пожалуйста, поставьте вашу подпись для подтверждения действия.</p>
                <div ref={signatureContainerRef} className="bg-gray-100 rounded-lg border-2 border-dashed w-full h-48">
                    {/* <SignatureCanvas 
                        ref={signatureRef} 
                        canvasProps={{ 
                            width: signatureCanvasSize.width, 
                            height: signatureCanvasSize.height, 
                            className: 'block' 
                        }} 
                    /> */}
                    <p className="text-center text-sm text-gray-500 py-16">
                         Функция подписи недоступна без внешней библиотеки.
                    </p>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    {/* <button onClick={() => signatureRef.current.clear()} className="text-sm font-semibold text-gray-600 hover:text-black">Очистить</button> */}
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

const LogModal = ({ log, users, onClose }) => {
    const getUserName = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Неизвестный пользователь';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Журнал действий</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon /></button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="border-b text-sm text-gray-500">
                            <tr>
                                <th className="p-2">Дата/Время</th>
                                <th className="p-2">Пользователь</th>
                                <th className="p-2">Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {log.map(entry => (
                                <tr key={entry.id} className="border-b">
                                    <td className="p-2 text-sm text-gray-500 align-top">{new Date(entry.timestamp).toLocaleString('ru-RU')}</td>
                                    <td className="p-2 font-semibold">{getUserName(entry.userId)}</td>
                                    <td className="p-2">{entry.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const WriteOffLogModal = ({ log, users, signatures, onClose }) => {
    const getUserName = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Неизвестный пользователь';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 animate-fade-in-up my-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Журнал списаний</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon /></button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="border-b text-sm text-gray-500">
                            <tr>
                                <th className="p-2">Дата/Время</th>
                                <th className="p-2">Пользователь</th>
                                <th className="p-2">Наименование</th>
                                <th className="p-2">Кол-во было/стало</th>
                                <th className="p-2">Подпись</th>
                            </tr>
                        </thead>
                        <tbody>
                            {log.map(entry => (
                                <tr key={entry.id} className="border-b">
                                    <td className="p-2 text-sm text-gray-500 align-top">{new Date(entry.timestamp).toLocaleString('ru-RU')}</td>
                                    <td className="p-2 font-semibold align-top">{getUserName(entry.userId)}</td>
                                    <td className="p-2 align-top">{entry.itemName}</td>
                                    <td className="p-2 align-top">{entry.quantityBefore} → {entry.quantityAfter}</td>
                                    <td className="p-2">
                                        {signatures[entry.signatureId] ? (
                                            <img src={signatures[entry.signatureId]} alt="Подпись" className="h-10 bg-gray-100 rounded" />
                                        ) : (
                                            <span className="text-xs text-gray-400">Нет</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const WriteOffModal = ({ title, warehouses, items, itemTypes, onSelectItem, onClose }) => {
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || null);
    const [activeFilter, setActiveFilter] = useState('all');
    const modalBodyRef = useRef(null);

    const formatCode = (code) => {
        if (!code || code.length !== 8) return '';
        return `${code.substring(0, 4)} ${code.substring(4, 8)}`;
    };

    const itemsOnWarehouse = items.filter(i => i.warehouseId === selectedWarehouseId);

    const itemCounts = itemsOnWarehouse.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {});

    const sortedItemTypes = itemTypes
        .map(type => ({
            ...type,
            count: itemCounts[type.name] || 0
        }))
        .filter(type => type.count > 0)
        .sort((a, b) => b.count - a.count);

    const filteredItems = activeFilter === 'all'
        ? itemsOnWarehouse
        : itemsOnWarehouse.filter(item => item.type === activeFilter);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 animate-fade-in-up my-auto flex flex-col" style={{maxHeight: '90vh'}}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon /></button>
                </div>

                <div className="flex-shrink-0 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Выберите склад:</label>
                    <select
                        value={selectedWarehouseId || ''}
                        onChange={(e) => setSelectedWarehouseId(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-white"
                    >
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>

                {/* Sticky Filter */}
                <div className="sticky top-0 bg-white py-2 z-10 border-b">
                     <div className="flex overflow-x-auto space-x-2 pb-2">
                         <button onClick={() => setActiveFilter('all')} className={`flex-shrink-0 px-3 py-1 text-sm font-semibold rounded-full ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                             Все
                         </button>
                         {sortedItemTypes.map(type => (
                             <button key={type.id} onClick={() => setActiveFilter(type.name)} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${activeFilter === type.name ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`} style={{backgroundColor: activeFilter !== type.name ? '#e5e7eb' : type.color, color: activeItemTypeFilter !== type.name ? '#374151' : 'white'}}>
                                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'white'}}></div>
                                 {type.name}
                             </button>
                         ))}
                     </div>
                </div>

                {/* Item List */}
                <div ref={modalBodyRef} className="overflow-y-auto mt-4">
                    <div className="space-y-3">
                        {filteredItems.length > 0 ? filteredItems.map(item => {
                             const itemType = itemTypes.find(it => it.name === item.type);
                             return (
                                <div
                                    key={item.id}
                                    onClick={() => onSelectItem(item)}
                                    className="bg-gray-50 p-3 rounded-lg flex items-start justify-between cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-start gap-3 flex-grow">
                                        <div style={{width: '30px', height: '30px', backgroundColor: itemType?.color || '#ccc', borderRadius: '4px', flexShrink: 0}}></div>
                                        <div>
                                            <p className="font-bold text-gray-800">{item.name}</p>
                                            <p className="text-xs font-mono text-gray-400 tracking-widest">{formatCode(item.uniqueCode)}</p>
                                            <p className="text-sm text-gray-600">Тип: {item.type} | Размер: {item.size} | Кол-во: {item.quantity}</p>
                                            <p className="text-sm text-gray-500 mt-1">Место: #{item.placeId !== null ? item.placeId + 1 : 'Не указано'}</p>
                                        </div>
                                    </div>
                                </div>
                             )
                        }) : <p className="text-center text-gray-500 py-8">На этом складе нет позиций с выбранным типом.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RouteInfoModal = ({ routeInfo, onClose, onOpenMap }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Маршрут</h2>
                {routeInfo.loading && <p>Получение данных о маршруте...</p>}
                {routeInfo.error && <p className="text-red-600">{routeInfo.error}</p>}
                {routeInfo.eta && (
                    <div className="space-y-4">
                        <p className="text-lg">{routeInfo.eta}</p>
                        <button 
                            onClick={onOpenMap}
                            className="w-full px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold"
                        >
                            Открыть карту
                        </button>
                    </div>
                )}
                <div className="mt-6">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Закрыть</button>
                </div>
            </div>
        </div>
    );
};


// --- Основной компонент приложения ---
export default function App() {
  // --- State ---
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login'); 
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [signatures, setSignatures] = useState({});
  const [log, setLog] = useState([]);
  const [writeOffLog, setWriteOffLog] = useState([]);
  const [routeInfo, setRouteInfo] = useState({ eta: null, loading: false, error: null, url: null });
  const [routeConfig, setRouteConfig] = useState([]); 
  
  // Modals and editors state
  const [warehouseIdForEditor, setWarehouseIdForEditor] = useState(null);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isPlacesEditorOpen, setPlacesEditorOpen] = useState(false);
  const [isItemEditorOpen, setItemEditorOpen] = useState(false);
  const [isItemTypesManagerOpen, setItemTypesManagerOpen] = useState(false);
  const [viewingPlaceInfo, setViewingPlaceInfo] = useState(null);
  const [isContactsModalOpen, setContactsModalOpen] = useState(false);
  const [isUserModerationModalOpen, setUserModerationModalOpen] = useState(false);
  const [isDriverSettingsModalOpen, setDriverSettingsModalOpen] = useState(false); // New state for Driver Settings modal
  const [isProfileEditorOpen, setProfileEditorOpen] = useState(false);
  const [itemForAction, setItemForAction] = useState(null);
  const [verifyingItem, setVerifyingItem] = useState(null);
  const [itemToPrint, setItemToPrint] = useState(null);
  const [isScenariosModalOpen, setScenariosModalOpen] = useState(false);
  const [isCreateScenarioModalOpen, setCreateScenarioModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingWriteOff, setPendingWriteOff] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [isLogModalOpen, setLogModalOpen] = useState(false);
  const [isWriteOffLogOpen, setWriteOffLogOpen] = useState(false);
  const [isWriteOffModalOpen, setWriteOffModalOpen] = useState(false);
  const [isMoveSelectionModalOpen, setMoveSelectionModalOpen] = useState(false);
  
  // UI State
  const [mainViewTab, setMainViewTab] = useState('mainMenu'); 
  const [expandedWarehouses, setExpandedWarehouses] = useState([]);
  const [isActionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [qrScanPurpose, setQrScanPurpose] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeItemTypeFilter, setActiveItemTypeFilter] = useState('all');
  
  // Refs
  const actionsMenuRef = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(80);
  const [scenarioToPrint, setScenarioToPrint] = useState(null);
  const scenarioPrintRef = useRef();
  const hasLoadedData = useRef(false);
  const SESSION_STORAGE_KEY = 'warehouseAppSession';

    const generateUniqueCode = (existingItems) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code;
        let isUnique = false;
        const existingCodes = new Set(existingItems.map(item => item.uniqueCode));

        while (!isUnique) {
            code = '';
            for (let i = 0; i < 8; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            if (!existingCodes.has(code)) {
                isUnique = true;
            }
        }
        return code;
    };

    const formatCode = (code) => {
        if (!code || code.length !== 8) return '';
        return `${code.substring(0, 4)} ${code.substring(4, 8)}`;
    };

    const handleRouteClick = () => {
        const destination = "10681 Production Ave, Fontana, CA 92337";
    
        if (navigator.geolocation) {
            setRouteInfo({ eta: null, loading: true, error: null, url: null });
    
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const origin = `${latitude},${longitude}`;
                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(destination)}`;
    
                    try {
                        // NOTE: For this to work, you need a server endpoint (/get-route-eta)
                        // that securely calls the Google Maps API with your key.
                        // const etaData = await api.getRouteEta({ latitude, longitude });
                        // const arrivalTime = new Date(Date.now() + etaData.durationInSeconds * 1000);
    
                        // --- TEMPORARY SOLUTION (without a backend): Open map directly ---
                        // Replace this block with a real API call when ready.
                        setRouteInfo({
                            eta: `Нажмите "Открыть карту", чтобы построить маршрут.`,
                            loading: false,
                            error: null,
                            url: mapsUrl
                        });
                        // --- END OF TEMPORARY SOLUTION ---
    
                    } catch (error) {
                        setRouteInfo({ eta: null, loading: false, error: 'Не удалось рассчитать маршрут. ' + error.message, url: null });
                    }
                },
                (error) => {
                    let errorMessage = "Не удалось получить вашу геолокацию. ";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += "Вы запретили доступ к геолокации.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += "Информация о местоположении недоступна.";
                            break;
                        case error.TIMEOUT:
                            errorMessage += "Время запроса на геолокацию истекло.";
                            break;
                        default:
                            errorMessage += "Произошла неизвестная ошибка.";
                            break;
                    }
                    setRouteInfo({ eta: null, loading: false, error: errorMessage, url: null });
                }
            );
        } else {
            alert("Геолокация не поддерживается вашим браузером.");
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
                setActionsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [actionsMenuRef]);

    useLayoutEffect(() => {
      const updateHeaderHeight = () => {
        if (headerRef.current) {
          setHeaderHeight(headerRef.current.offsetHeight);
        }
      }
      updateHeaderHeight();
      window.addEventListener('resize', updateHeaderHeight);
      return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);

  const handlePrintScenario = () => {
      alert('Функция печати не поддерживается в этом окружении.');
  };

  useEffect(() => {
      if (scenarioToPrint) {
          handlePrintScenario();
      }
  }, [scenarioToPrint, handlePrintScenario]);

  const addLogEntry = (action, details = null) => {
    if (!currentUser) return;

    let fullAction = action;

    if (details && details.before && details.after) {
        const { before, after } = details;
        const changes = [];

        const fieldNames = {
            name: 'Наименование', address: 'Адрес', hours: 'Часы работы',
            gate_code: 'Код ворот', lock_code: 'Код замка', type: 'Тип',
            size: 'Размер', quantity: 'Количество', firstName: 'Имя',
            lastName: 'Фамилия', position: 'Должность', phone: 'Телефон',
            role: 'Роль', assignedWarehouseId: 'Склад', warehouseId: 'Склад',
            placeId: 'Место', plateNumber: 'Номерной знак', capacity: 'Грузоподъемность',
            maxPallets: 'Паллет', workingDays: 'Рабочие дни', nonWorkingHours: 'Нерабочее время'
        };

        const getWarehouseName = (id) => {
             if (id === 'office' || !id) return 'Офис';
             if (id === 'unassigned') return 'Не привязан';
             return warehouses.find(w => w.id === id)?.name || id;
        };
        
        for (const key in after) {
            if (Object.prototype.hasOwnProperty.call(before, key) && JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
                const fieldName = fieldNames[key] || key;
                let beforeValue = before[key] ?? 'пусто';
                let afterValue = after[key] ?? 'пусто';

                if (key === 'assignedWarehouseId' || key === 'warehouseId') {
                    beforeValue = getWarehouseName(beforeValue);
                    afterValue = getWarehouseName(afterValue);
                }
                
                if (key === 'placeId') {
                    beforeValue = beforeValue === null ? 'нет' : `#${beforeValue + 1}`;
                    afterValue = afterValue === null ? 'нет' : `#${afterValue + 1}`;
                }

                changes.push(`${fieldName}: '${beforeValue}' -> '${afterValue}'`);
            }
        }

        if (changes.length > 0) {
            fullAction += `: ${changes.join('; ')}`;
        }
    }

    const newLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      action: fullAction,
    };
    setLog(prevLog => [newLogEntry, ...prevLog]);
  };

  const handleLogin = async (credentials) => {
      const user = await api.loginUser(credentials);
      const now = new Date().getTime();
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: user, loginTime: now }));
      addLogEntry('Вход в приложение');
      window.location.reload();
  };

  const handleRegister = async (formData) => {
      const newUser = await api.registerUser(formData);
      const now = new Date().getTime();
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: newUser, loginTime: now }));
      addLogEntry('Регистрация нового пользователя');
      window.location.reload();
  };
  
  const handleLogout = () => {
      addLogEntry('Выход из приложения');
      setCurrentUser(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      hasLoadedData.current = false;
      setWarehouses([]);
      setItems([]);
      setScenarios([]);
      setSignatures({});
      setLog([]);
      setWriteOffLog([]);
      setRouteConfig([]); 
      setWarehouseIdForEditor(null);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
        const originalUser = users.find(u => u.id === updatedUser.id);
        const savedUser = await api.updateUser(updatedUser);
        setUsers(users.map(u => u.id === savedUser.id ? savedUser : u));
        
        addLogEntry(`Обновил данные пользователя ${savedUser.username}`, { before: originalUser, after: savedUser });

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
        const deletedUser = users.find(u => u.id === userId);
        setUsers(users.filter(u => u.id !== userId));
        addLogEntry(`Удалил пользователя: ${deletedUser?.username || `ID: ${userId}`}`);
    } catch (error) {
        console.error("Не удалось удалить пользователя:", error);
    }
  };

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
            const appData = await api.request('/data/for-registration');
            setWarehouses(appData.warehouses || []);
        } catch(error) {
            console.error("Не удалось загрузить склады для регистрации:", error);
        }
      }
    };

    initializeApp();
  }, []);
  
  useEffect(() => {
      const loadDataForUser = async () => {
          if (currentUser && currentUser.role !== 'На модерации' && !hasLoadedData.current) {
              setLoading(true);
              try {
                  const [appData, usersData] = await Promise.all([
                      api.fetchAppData(currentUser.id),
                      api.fetchUsers()
                  ]);

                  let loadedItems = appData.items || [];
                
                  const itemsToUpdate = loadedItems.filter(item => !item.uniqueCode);
                  if (itemsToUpdate.length > 0) {
                      const existingCodes = new Set(loadedItems.map(item => item.uniqueCode).filter(Boolean));
                      const generateUniqueCodeForMigration = () => {
                           const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                           let code;
                           do {
                               code = '';
                               for (let i = 0; i < 8; i++) {
                                   code += chars.charAt(Math.floor(Math.random() * chars.length));
                               }
                           } while (existingCodes.has(code));
                           existingCodes.add(code);
                           return code;
                      };
  
                      loadedItems = loadedItems.map(item => 
                          item.uniqueCode ? item : { ...item, uniqueCode: generateUniqueCodeForMigration() }
                      );
                  }

                  setWarehouses(appData.warehouses || []);
                  setItems(loadedItems);
                  setItemTypes(appData.itemTypes || []);
                  setScenarios(appData.scenarios || []);
                  setSignatures(appData.signatures || {});
                  setLog(appData.log || []);
                  setWriteOffLog(appData.writeOffLog || []);
                  setRouteConfig(appData.routeConfig || []); 
                  setUsers(usersData || []);
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

    setIsSaving(true);
    const fullState = { warehouses, items, itemTypes, scenarios, signatures, log, writeOffLog, routeConfig }; 
    api.saveAppData(currentUser.id, fullState)
      .catch(error => {
        console.error("Ошибка при автоматическом сохранении данных:", error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [warehouses, items, itemTypes, scenarios, signatures, log, writeOffLog, routeConfig, currentUser, loading]);

    const stateRef = useRef();
    stateRef.current = { warehouses, items, itemTypes, scenarios, signatures, log, writeOffLog, routeConfig, users, editingWarehouse, isPlacesEditorOpen, isItemEditorOpen, isItemTypesManagerOpen, itemForAction, isCreateScenarioModalOpen, verifyingItem, editingItem, isScenariosModalOpen, isSaving };

    useEffect(() => {
        if (!currentUser || currentUser.role === 'На модерации') {
            return;
        }

        const intervalId = setInterval(async () => {
            const currentState = stateRef.current;
            const isBusy = currentState.isSaving || currentState.editingWarehouse || currentState.isPlacesEditorOpen || currentState.isItemEditorOpen || currentState.isItemTypesManagerOpen || currentState.itemForAction || currentState.isCreateScenarioModalOpen || currentState.verifyingItem || currentState.editingItem || currentState.isScenariosModalOpen;

            if (isBusy) {
                return;
            }

            try {
                const [newData, newUsers] = await Promise.all([api.fetchAppData(currentUser.id), api.fetchUsers()]);

                const currentAppData = { warehouses: currentState.warehouses, items: currentState.items, itemTypes: currentState.itemTypes, scenarios: currentState.scenarios, signatures: currentState.signatures, log: currentState.log, writeOffLog: currentState.writeOffLog, routeConfig: currentState.routeConfig };
                if (JSON.stringify(newData) !== JSON.stringify(currentAppData)) {
                    setWarehouses(newData.warehouses || []);
                    setItems(newData.items || []);
                    setItemTypes(newData.itemTypes || []);
                    setScenarios(newData.scenarios || []);
                    setSignatures(newData.signatures || {});
                    setLog(newData.log || []);
                    setWriteOffLog(newData.writeOffLog || []);
                    setRouteConfig(newData.routeConfig || []);
                }

                if (JSON.stringify(newUsers) !== JSON.stringify(currentState.users)) {
                    setUsers(newUsers || []);
                }
            } catch (error) {
                console.error("Ошибка при фоновом обновлении данных:", error);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [currentUser]);

  const handleSaveWarehouse = (data) => {
    const isNew = !data.id;
    const savedData = { ...data, id: data.id || crypto.randomUUID() };
    const originalWarehouse = warehouses.find(w => w.id === savedData.id);

    setWarehouses(prev => {
        const exists = prev.some(w => w.id === savedData.id);
        if (exists) return prev.map(w => w.id === savedData.id ? { ...w, ...savedData } : w);
        return [...prev, { ...savedData, places: [] }];
    });
    
    if(isNew) {
        addLogEntry(`Создал склад: ${savedData.name}`);
    } else {
        const beforeData = { name: originalWarehouse.name, address: originalWarehouse.address, hours: originalWarehouse.hours, gate_code: originalWarehouse.gate_code, lock_code: originalWarehouse.lock_code };
        addLogEntry(`Отредактировал склад ${savedData.name}`, { before: beforeData, after: savedData });
    }
    
    setEditingWarehouse(null);
  };

  const handleSavePlaces = (placesData) => {
    setWarehouses(prev => prev.map(w => w.id === warehouseIdForEditor ? { ...w, places: placesData } : w));
    const warehouseName = warehouses.find(w => w.id === warehouseIdForEditor)?.name;
    addLogEntry(`Отредактировал места на складе: ${warehouseName}`);
    setPlacesEditorOpen(false);
  };
  const handleSaveItem = (itemData) => {
    const newCode = generateUniqueCode(items);
    const newItem = { ...itemData, uniqueCode: newCode };
    setItems(prev => [...prev, newItem]);
    addLogEntry(`Создал позицию: ${newItem.name}`);
    setItemEditorOpen(false);
  };
  const handleSaveItemTypes = (types) => {
    setItemTypes(types);
    addLogEntry('Отредактировал типы позиций');
    setItemTypesManagerOpen(false);
  };

  const handleSaveEditedItem = (updatedItem) => {
    const originalItem = items.find(item => item.id === updatedItem.id);
    setItems(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)));
    addLogEntry(`Отредактировал позицию '${updatedItem.name}'`, { before: originalItem, after: updatedItem });
    setEditingItem(null);
  };
  
  const handleItemActionMove = ({ destination, quantity, unit }) => {
    if (currentUser.role === 'Водитель') {
        setPendingMove({ item: itemForAction, destination, quantity, unit });
        setItemForAction(null);
        return;
    }

    const originalItem = items.find(item => item.id === itemForAction.id);
    setItems(prevItems => {
        if (!originalItem) return prevItems;

        if (quantity >= originalItem.quantity) {
            return prevItems.map(item =>
                item.id === itemForAction.id
                    ? { ...item, warehouseId: destination.warehouseId, placeId: destination.placeId, size: unit }
                    : item
            );
        }

        const updatedOriginalItem = { ...originalItem, quantity: originalItem.quantity - quantity };
        const newItem = { ...originalItem, id: crypto.randomUUID(), quantity: quantity, warehouseId: destination.warehouseId, placeId: destination.placeId, size: unit };

        return prevItems.map(item =>
            item.id === itemForAction.id ? updatedOriginalItem : item
        ).concat(newItem);
    });
    const fromWarehouseName = warehouses.find(w => w.id === originalItem.warehouseId)?.name || 'Нераспределенные';
    const toWarehouseName = warehouses.find(w => w.id === destination.warehouseId)?.name;
    addLogEntry(`Разделил и переместил ${quantity} ${unit} '${originalItem.name}' из '${fromWarehouseName}' в '${toWarehouseName}'`);
    setItemForAction(null);
  };

  const handleConfirmMove = (signatureData) => {
    if (!pendingMove) return;

    const { item, destination, quantity, unit } = pendingMove;
    const signatureId = `sig_${crypto.randomUUID()}`;

    setSignatures(prev => ({...prev, [signatureId]: signatureData }));

    const originalItem = items.find(i => i.id === item.id);
    setItems(prevItems => {
        if (!originalItem) return prevItems;

        if (quantity >= originalItem.quantity) {
            return prevItems.map(i =>
                i.id === item.id
                    ? { ...i, warehouseId: destination.warehouseId, placeId: destination.placeId, size: unit }
                    : i
            );
        }

        const updatedOriginalItem = { ...originalItem, quantity: originalItem.quantity - quantity };
        const newItem = { ...originalItem, id: crypto.randomUUID(), quantity: quantity, warehouseId: destination.warehouseId, placeId: destination.placeId, size: unit };

        return prevItems.map(i =>
            i.id === item.id ? updatedOriginalItem : i
        ).concat(newItem);
    });

    const fromWarehouseName = warehouses.find(w => w.id === originalItem.warehouseId)?.name || 'Нераспределенные';
    const toWarehouseName = warehouses.find(w => w.id === destination.warehouseId)?.name;
    addLogEntry(`Водитель переместил ${quantity} ${unit} '${originalItem.name}' из '${fromWarehouseName}' в '${toWarehouseName}' (подписано)`);

    setPendingMove(null);
  };

  const handleItemActionWriteOff = (item) => {
      setItemForAction(null);
      setPendingWriteOff({ item: item });
  };
  
  const handleConfirmWriteOff = (signatureData) => {
      if (!pendingWriteOff) return;
      
      const itemToOff = pendingWriteOff.item;
      const signatureId = `sig_${crypto.randomUUID()}`;
      
      setSignatures(prev => ({...prev, [signatureId]: signatureData }));
      
      const writeOffEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          userId: currentUser.id,
          itemName: itemToOff.name,
          quantityBefore: itemToOff.quantity,
          quantityAfter: 0,
          signatureId: signatureId,
      };
      setWriteOffLog(prev => [writeOffEntry, ...prev]);
      
      setItems(prevItems => prevItems.filter(item => item.id !== itemToOff.id));
      
      addLogEntry(`Списал позицию: ${itemToOff.name} (Кол-во: ${itemToOff.quantity})`);
      
      setPendingWriteOff(null);
  }

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
    addLogEntry(`Создал задачу #${newScenario.number}`);
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
                    
                    const itemsToMoveInScenario = updatedScenario.items;
                    const destinationWarehouseId = updatedScenario.toWarehouseId;

                    setItems(prevItems => {
                        let newItems = [...prevItems];
                        const itemsToAdd = [];

                        for (const itemId in itemsToMoveInScenario) {
                            const moveQuantity = itemsToMoveInScenario[itemId];
                            const originalItemIndex = newItems.findIndex(i => i.id === itemId);
                            if (originalItemIndex === -1) continue;

                            const originalItem = newItems[originalItemIndex];

                            if (moveQuantity < originalItem.quantity) {
                                newItems[originalItemIndex] = {
                                    ...originalItem,
                                    quantity: originalItem.quantity - moveQuantity
                                };
                                const movedItemPart = {
                                    ...originalItem,
                                    id: crypto.randomUUID(),
                                    quantity: moveQuantity,
                                    warehouseId: destinationWarehouseId,
                                    placeId: null
                                };
                                itemsToAdd.push(movedItemPart);
                            } else {
                                newItems[originalItemIndex] = {
                                    ...originalItem,
                                    warehouseId: destinationWarehouseId,
                                    placeId: null
                                };
                            }
                        }
                        return [...newItems, ...itemsToAdd];
                    });
                }
                return updatedScenario;
            }
            return s;
        })
    );
    addLogEntry(`Обновил статус задачи #${scenario.number} на '${newStatus}'`);
    setPendingAction(null);
};
  
  const handleDeleteScenario = (scenarioId) => {
    // Note: Replaced alert with custom modal for consistency in a real app
    if (window.confirm('Вы уверены, что хотите удалить этот сценарий? Это действие необратимо.')) {
        setScenarios(prevScenarios => prevScenarios.filter(s => s.id !== scenarioId));
        const scenarioNumber = scenarios.find(s => s.id === scenarioId)?.number;
        addLogEntry(`Удалил задачу #${scenarioNumber}`);
    }
  };

  const handleVerificationSuccess = (verifiedItem) => {
      setVerifyingItem(null);
      if (qrScanPurpose === 'action') {
          setItemForAction(verifiedItem);
      }
  };
  
  const handleStartEditWarehouse = (warehouse) => { 
    setEditingWarehouse(warehouse);
  };
  
  const handleDeleteWarehouse = (warehouseIdToDelete) => {
    // Note: Replaced alert with custom modal for consistency in a real app
    if (window.confirm('Вы уверены, что хотите удалить этот склад? Все связанные с ним товары станут нераспределенными.')) {
      const warehouseName = warehouses.find(w => w.id === warehouseIdToDelete)?.name;
      setWarehouses(prev => prev.filter(w => w.id !== warehouseIdToDelete));
      setItems(prev => prev.map(i => i.warehouseId === warehouseIdToDelete ? { ...i, warehouseId: 'unassigned', placeId: null } : i));
      addLogEntry(`Удалил склад: ${warehouseName}`);
    }
  };
  
  const handleResetPlaces = (warehouseId) => {
    const warehouseName = warehouses.find(w => w.id === warehouseId)?.name;
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
    addLogEntry(`Сбросил места на складе: ${warehouseName}`);
    setPlacesEditorOpen(false);
  };

  const toggleWarehouseExpansion = (warehouseId) => {
    setExpandedWarehouses(prev =>
        prev.includes(warehouseId)
            ? prev.filter(id => id !== warehouseId)
            : [...prev, warehouseId]
    );
  };

  const handleSelectItemToWriteOff = (item) => {
    setWriteOffModalOpen(false);
    setPendingWriteOff({ item: item });
  };

  const useSwipeNavigation = (itemCount) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
        touchEndX.current = 0;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current === 0 || touchEndX.current === 0 || itemCount === 0) return;
        const swipeDistance = touchStartX.current - touchEndX.current;
        const swipeThreshold = 50;
        
        let newIndex = activeIndex;
        if (swipeDistance > swipeThreshold) {
             newIndex = (activeIndex + 1) % itemCount;
        } else if (swipeDistance < -swipeThreshold) {
             newIndex = (activeIndex - 1 + itemCount) % itemCount;
        }
        
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    };
    
    return { activeIndex, setActiveIndex, handleTouchStart, handleTouchMove, handleTouchEnd };
  };
  
  const sortedWarehouses = [{ id: 'all', name: 'Все склады' }, ...[...warehouses].sort((a, b) => a.name.localeCompare(b.name))];
  const { activeIndex, setActiveIndex, ...swipeHandlers } = useSwipeNavigation(sortedWarehouses.length);

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
  
  const activeWarehouseId = sortedWarehouses[activeIndex]?.id;
  const itemsToDisplay = activeWarehouseId === 'all' 
    ? items 
    : items.filter(item => item.warehouseId === activeWarehouseId);
  
  const itemCounts = itemsToDisplay.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const sortedAndFilteredItemTypes = itemTypes
    .map(type => ({
        ...type,
        count: itemCounts[type.name] || 0
    }))
    .filter(type => type.count > 0)
    .sort((a, b) => b.count - a.count);

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
  const sortedUnassignedFilteredItems = filteredAndSortedItems(items.filter(item => item.warehouseId === 'unassigned' && activeWarehouseId === 'all'));

  const viewingPlace = warehouses.find(w => w.id === viewingPlaceInfo?.warehouseId)?.places?.find(p => p.id === viewingPlaceInfo?.placeId);
  const itemsOnViewingPlace = items.filter(i => i.placeId === viewingPlaceInfo?.placeId && i.warehouseId === viewingPlaceInfo?.warehouseId);
  const notificationCount = scenarios.filter(s => s.status === 'new' || s.status === 'accepted').length;

  const isActionableUser = userRole === 'Администратор' || userRole === 'Сотрудник склада';

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div ref={headerRef} className="max-w-7xl mx-auto sticky top-0 z-40 bg-gray-100 pt-4 px-4">
        <div className="bg-white p-3 rounded-xl shadow-md flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
                 <button onClick={() => setProfileEditorOpen(true)} className="flex items-center justify-center p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold transition">
                    <UserIcon />
                </button>
                <button onClick={() => setScenariosModalOpen(true)} className="relative flex items-center justify-center p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold transition">
                    <ScenariosIcon />
                    {notificationCount > 0 && (
                        <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-red-100 bg-red-600 rounded-full">
                            {notificationCount}
                        </span>
                    )}
                </button>
                 <button 
                    onClick={() => { 
                        setQrScanPurpose('action'); 
                        setVerifyingItem({ id: 'any', name: 'любой товар' });
                    }} 
                    className="flex items-center justify-center p-2 rounded-lg text-white bg-red-500 hover:bg-red-600 font-semibold transition"
                >
                    <QrIcon color="white" />
                </button>
            </div>
            <div className="flex items-center gap-2" ref={actionsMenuRef}>
                <button onClick={() => setContactsModalOpen(true)} className="flex items-center justify-center p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold transition">
                    <ContactsIcon />
                </button>
                {userRole === 'Администратор' && (
                    <div className="relative">
                        <button 
                            onClick={() => setActionsMenuOpen(prev => !prev)}
                            className="flex items-center justify-center p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold transition"
                        >
                            <PlusIcon/>
                        </button>
                        {isActionsMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border z-50 p-2">
                                <button 
                                    onClick={() => {
                                        setItemEditorOpen(true);
                                        setActionsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                                >
                                    <FilePlusIcon /> Создать позицию
                                </button>
                                <div className="my-1 h-px bg-gray-200" />
                                <button 
                                    onClick={() => { setLogModalOpen(true); addLogEntry('Открыл журнал действий'); setActionsMenuOpen(false); }} 
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                                >
                                    <JournalIcon /> Журнал событий
                                </button>
                                <button 
                                    onClick={() => { setWriteOffLogOpen(true); addLogEntry('Открыл журнал списаний'); setActionsMenuOpen(false); }} 
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                                >
                                    <SignatureIcon /> Журнал списаний
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-4 mt-4">
        {warehouses.length > 0 ? (
            <div className="space-y-6">
                 <div className="bg-white rounded-xl shadow-md">
                    <div className="flex border-b">
                        <button 
                            onClick={() => setMainViewTab('mainMenu')} 
                            className={`flex-1 p-4 text-center font-bold transition-colors duration-300 ${mainViewTab === 'mainMenu' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        >
                            Главное меню
                        </button>
                        <button 
                            onClick={() => setMainViewTab('warehouses')} 
                            className={`flex-1 p-4 text-center font-bold transition-colors duration-300 ${mainViewTab === 'warehouses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        >
                            Позиции
                        </button>
                        <button 
                            onClick={() => setMainViewTab('places')} 
                            className={`flex-1 p-4 text-center font-bold transition-colors duration-300 ${mainViewTab === 'places' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        >
                            Схемы
                        </button>
                    </div>

                    <div>
                        {mainViewTab === 'mainMenu' && (
                            <div className="p-6 bg-gray-50 rounded-b-xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Управление складом:</h3>
                                <div className="space-y-4 max-w-md mx-auto">
                                    <button
                                        onClick={() => setItemEditorOpen(true)}
                                        className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-4"
                                    >
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FilePlusIcon /></div>
                                        <span className="font-semibold text-gray-700">Создать позицию</span>
                                    </button>
                                    <button
                                        onClick={() => setMoveSelectionModalOpen(true)}
                                        className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-4"
                                    >
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TruckIcon width="18" height="18" /></div>
                                        <span className="font-semibold text-gray-700">Переместить/удалить позицию</span>
                                    </button>
                                    <button
                                        onClick={handleRouteClick}
                                        className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-4"
                                    >
                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><MapPinIcon /></div>
                                        <span className="font-semibold text-gray-700">Маршрут</span>
                                    </button>
                                    {/* --- НОВАЯ КНОПКА --- */}
                                    <button
                                        onClick={() => setMainViewTab('routeConfig')}
                                        className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-4"
                                    >
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><RouteIcon /></div>
                                        <span className="font-semibold text-gray-700">Настройка маршрута</span>
                                    </button>
                                    {/* --- НОВАЯ КНОПКА --- */}
                                    <button
                                        onClick={() => setDriverSettingsModalOpen(true)}
                                        className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-4"
                                    >
                                        <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><CarIcon /></div>
                                        <span className="font-semibold text-gray-700">Настройка водителей</span>
                                    </button>
                                </div>
                            </div>
                        )}
                        {mainViewTab === 'warehouses' && (
                            <div className="p-4">
                                <div {...swipeHandlers}>
                                    <div className="overflow-hidden">
                                        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                                            {sortedWarehouses.map((w, index) => (
                                                <div key={w.id} className="w-full flex-shrink-0 px-1">
                                                    {w.id === 'all' ? (
                                                        <div className="bg-gray-50 rounded-xl p-4 h-full">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-gray-800">Все склады</h3>
                                                                    <p className="text-sm text-gray-500">Обзор всех позиций</p>
                                                                </div>
                                                                {userRole === 'Администратор' && activeIndex === 0 && (
                                                                    <button onClick={() => setEditingWarehouse({})} className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition">
                                                                        <PlusIcon />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <AllWarehousesFreeSpace warehouses={warehouses} items={items} />
                                                        </div>
                                                    ) : (
                                                        <WarehouseInfoBlock 
                                                            warehouse={w}
                                                            onEdit={handleStartEditWarehouse}
                                                            userRole={userRole}
                                                            isExpanded={expandedWarehouses.includes(w.id)}
                                                            onToggleExpansion={toggleWarehouseExpansion}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center mt-4 space-x-4">
                                        <button onClick={() => setActiveIndex(prev => (prev - 1 + sortedWarehouses.length) % sortedWarehouses.length)} className="p-2"><ArrowLeftIcon /></button>
                                        <div className="flex space-x-2">
                                            {sortedWarehouses.map((_, index) => (
                                                <div key={index} onClick={() => setActiveIndex(index)} className={`w-2 h-2 rounded-full cursor-pointer ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                                            ))}
                                        </div>
                                        <button onClick={() => setActiveIndex(prev => (prev + 1) % sortedWarehouses.length)} className="p-2"><ArrowRightIcon /></button>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-4 border-t">
                                     <h3 className="text-sm font-semibold text-gray-500 mb-3">СПИСОК ПОЗИЦИЙ</h3>
                                     <div style={{ top: `${headerHeight}px` }} className="sticky z-30 bg-white flex overflow-x-auto space-x-2 mb-4 border-b pb-2 pt-2 -mx-4 px-4">
                                         <button onClick={() => setActiveItemTypeFilter('all')} className={`flex-shrink-0 px-3 py-1 text-sm font-semibold rounded-full ${activeItemTypeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Посмотреть все</button>
                                         {sortedAndFilteredItemTypes.map(type => (
                                             <button key={type.id} onClick={() => setActiveItemTypeFilter(type.name)} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${activeItemTypeFilter === type.name ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`} style={{backgroundColor: activeItemTypeFilter !== type.name ? '#e5e7eb' : type.color, color: activeItemTypeFilter !== type.name ? '#374151' : 'white'}}>
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
                                                         className={`${isUnplaced ? 'bg-red-50' : 'bg-gray-50'} p-3 rounded-lg flex items-start justify-between ${isLocked ? 'opacity-60' : ''}`}
                                                     >
                                                         <div className="flex items-start gap-3 flex-grow" onClick={() => { if (userRole === 'Администратор' && !isLocked) { setEditingItem(item); } }}>
                                                             <div style={{width: '30px', height: '30px', backgroundColor: itemType?.color || '#ccc', borderRadius: '4px', flexShrink: 0}}></div>
                                                             <div>
                                                                 <p className="font-bold text-gray-800">{item.name}</p>
                                                                 <p className="text-xs font-mono text-gray-400 tracking-widest">{formatCode(item.uniqueCode)}</p>
                                                                 <p className="text-sm text-gray-600">Тип: {item.type} | Размер: {item.size} | Кол-во: {item.quantity}</p>
                                                                 {isUnplaced ? (
                                                                     <p className="text-sm text-red-600 mt-1">Склад: {itemWarehouse?.name} / Местоположение не задано</p>
                                                                 ) : (
                                                                     <p className="text-sm text-gray-500 mt-1">Склад: {itemWarehouse?.name} / Место: #{item.placeId + 1}</p>
                                                                 )}
                                                             </div>
                                                         </div>
                                                         <div className="flex items-center flex-shrink-0 ml-2">
                                                             <button onClick={(e) => { e.stopPropagation(); setItemToPrint(item); }} className="text-gray-400 hover:text-blue-600 p-2"><PrintIcon width="20" height="20"/></button>
                                                             {!isLocked && isActionableUser && (
                                                                <button onClick={(e) => { e.stopPropagation(); setQrScanPurpose('action'); setVerifyingItem(item); }} className="text-gray-400 hover:text-green-600 p-2"><TruckIcon width="20" height="20"/></button>
                                                             )}
                                                         </div>
                                                     </div>
                                             )})}
                                         </div>
                                     ) : (<div className="text-center text-gray-400 py-8">Позиций с выбранным типом нет</div>)}
                                     
                                     {sortedUnassignedFilteredItems.length > 0 && (
                                         <div className="mt-6 pt-4 border-t">
                                             <h3 className="text-sm font-semibold text-gray-500 mb-3">ПОЛНОСТЬЮ НЕРАСПРЕДЕЛЕННЫЕ</h3>
                                             <div className="space-y-3">
                                                 {sortedUnassignedFilteredItems.map(item => {
                                                     const itemType = itemTypes.find(it => it.name === item.type);
                                                     const isLocked = lockedItemIds.has(item.id);
                                                     return (
                                                     <div key={item.id} className={`bg-red-50 p-3 rounded-lg flex items-start justify-between ${isLocked ? 'opacity-60' : ''}`}>
                                                         <div className="flex items-start gap-3 flex-grow" onClick={() => { if (userRole === 'Администратор' && !isLocked) { setEditingItem(item); } }}>
                                                             <div style={{width: '30px', height: '30px', backgroundColor: itemType?.color || '#ccc', borderRadius: '4px', flexShrink: 0}}></div>
                                                             <div>
                                                                 <p className="font-bold text-gray-800">{item.name}</p>
                                                                 <p className="text-xs font-mono text-gray-400 tracking-widest">{formatCode(item.uniqueCode)}</p>
                                                                 <p className="text-sm text-gray-600">Тип: {item.type} | Размер: {item.size} | Кол-во: {item.quantity}</p>
                                                                 <p className="text-sm text-red-600 mt-1">Позиция не привязана к складу</p>
                                                             </div>
                                                         </div>
                                                         <div className="flex items-center flex-shrink-0 ml-2">
                                                             <button onClick={(e) => { e.stopPropagation(); setItemToPrint(item); }} className="text-gray-400 hover:text-blue-600 p-2"><PrintIcon width="20" height="20"/></button>
                                                              {!isLocked && isActionableUser && (
                                                                <button onClick={(e) => { e.stopPropagation(); setQrScanPurpose('action'); setVerifyingItem(item); }} className="text-gray-400 hover:text-green-600 p-2"><TruckIcon width="20" height="20"/></button>
                                                             )}
                                                         </div>
                                                     </div>
                                                 )})}
                                             </div>
                                         </div>
                                     )}
                                </div>
                            </div>
                        )}

                        {mainViewTab === 'places' && (
                             <div className="p-4" {...swipeHandlers}>
                                <div className="overflow-hidden">
                                    <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                                        {sortedWarehouses.map((w, index) => (
                                            <div key={w.id} className="w-full flex-shrink-0 px-1">
                                                {index === 0 ? (
                                                     <div className="bg-gray-50 rounded-xl p-4">
                                                        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Все склады</h3>
                                                        <p className="text-center text-sm text-gray-500 mb-4">Общая статистика по всем складам</p>
                                                        <div className="mt-4 pt-4 border-t w-full">
                                                          <PalletStats places={warehouses.flatMap(wh => wh.places || [])} items={items} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <WarehousePlacesBlock 
                                                        warehouse={w}
                                                        items={items}
                                                        itemTypes={itemTypes}
                                                        onPlaceSelect={setViewingPlaceInfo}
                                                        onEditPlaces={(id) => { setWarehouseIdForEditor(id); setPlacesEditorOpen(true); }}
                                                        userRole={userRole}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="sticky bottom-0 z-30 bg-gray-100/80 backdrop-blur-sm py-3 -mx-4 -mb-4 border-t border-gray-200/50 mt-4 flex justify-center items-center space-x-4">
                                     <button onClick={() => setActiveIndex(prev => (prev - 1 + sortedWarehouses.length) % sortedWarehouses.length)} className="p-2"><ArrowLeftIcon /></button>
                                     <div className="flex space-x-2">
                                        {sortedWarehouses.map((_, index) => (
                                            <div key={index} onClick={() => setActiveIndex(index)} className={`w-2 h-2 rounded-full cursor-pointer ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                                        ))}
                                    </div>
                                    <button onClick={() => setActiveIndex(prev => (prev + 1) % sortedWarehouses.length)} className="p-2"><ArrowRightIcon /></button>
                                </div>
                            </div>
                        )}
                        {mainViewTab === 'routeConfig' && (
                            <RouteConfigurator 
                                initialConfig={routeConfig}
                                onSave={(newConfig) => {
                                    setRouteConfig(newConfig);
                                    addLogEntry('Обновил конфигурацию маршрутов');
                                }}
                                onClose={() => setMainViewTab('mainMenu')}
                            />
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center py-10 bg-white rounded-xl shadow-md">
                <p className="text-gray-500 mb-4">Склады не найдены.</p>
                {userRole === 'Администратор' && (<button onClick={() => setEditingWarehouse({})} className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold transition"><PlusIcon /><span className="ml-2">Создать первый склад</span></button>)}
            </div>
        )}
      </div>
      
      {/* --- Modals --- */}
      {isProfileEditorOpen && <ProfileEditorModal user={currentUser} warehouses={warehouses} onSave={handleUpdateUser} onClose={() => setProfileEditorOpen(false)} onLogout={handleLogout} />}
      {editingWarehouse && <WarehouseEditor initialData={editingWarehouse} onSave={handleSaveWarehouse} onCancel={() => setEditingWarehouse(null)} />}
      {isPlacesEditorOpen && warehouses.find(w => w.id === warehouseIdForEditor) && <PlacesEditor initialPlaces={warehouses.find(w => w.id === warehouseIdForEditor).places || []} onSave={handleSavePlaces} onCancel={() => setPlacesEditorOpen(false)} onReset={() => handleResetPlaces(warehouseIdForEditor)} />}
      {isItemEditorOpen && <ItemEditor warehouses={warehouses} itemTypes={itemTypes} onSave={handleSaveItem} onCancel={() => setItemEditorOpen(false)} onManageTypes={() => setItemTypesManagerOpen(true)} items={items} userRole={userRole} />}
      {editingItem && <ItemEditModal itemToEdit={editingItem} itemTypes={itemTypes} onSave={handleSaveEditedItem} onCancel={() => setEditingItem(null)} />}
      {isItemTypesManagerOpen && <ItemTypesManager types={itemTypes} onSave={handleSaveItemTypes} onCancel={() => setItemTypesManagerOpen(false)} />}
      {viewingPlaceInfo && viewingPlace && <ItemsOnPlaceModal place={viewingPlace} items={itemsOnViewingPlace} itemTypes={itemTypes} onClose={() => setViewingPlaceInfo(null)} />}
      {isContactsModalOpen && <ContactsModal users={users} warehouses={warehouses} onClose={() => setContactsModalOpen(false)} userRole={userRole} onOpenModeration={() => { setContactsModalOpen(false); setUserModerationModalOpen(true); }} />}
      {isUserModerationModalOpen && <UserModerationModal users={users} warehouses={warehouses} onSave={handleUpdateUser} onDelete={handleDeleteUser} onClose={() => setUserModerationModalOpen(false)} currentUser={currentUser} />}
      {isLogModalOpen && userRole === 'Администратор' && <LogModal log={log} users={users} onClose={() => setLogModalOpen(false)} />}
      {isWriteOffLogOpen && userRole === 'Администратор' && <WriteOffLogModal log={writeOffLog} users={users} signatures={signatures} onClose={() => setWriteOffLogOpen(false)} />}
      {isDriverSettingsModalOpen && userRole === 'Администратор' && <DriverSettingsModal drivers={users.filter(u => u.role === 'Водитель')} onSaveDriver={handleUpdateUser} onClose={() => setDriverSettingsModalOpen(false)} />}
      {verifyingItem && <QRScannerModal itemToVerify={verifyingItem} allItems={items} onSuccess={handleVerificationSuccess} onCancel={() => setVerifyingItem(null)} />}
      {itemForAction && <ItemActionModal itemToAction={itemForAction} warehouses={warehouses} items={items} itemTypes={itemTypes} onMove={handleItemActionMove} onWriteOff={handleItemActionWriteOff} onCancel={() => setItemForAction(null)} />}
      {itemToPrint && <QRCodePrintModal item={itemToPrint} user={currentUser} onClose={() => setItemToPrint(null)} />}
      {(routeInfo.loading || routeInfo.eta || routeInfo.error) && 
        <RouteInfoModal 
            routeInfo={routeInfo} 
            onClose={() => setRouteInfo({ eta: null, loading: false, error: null, url: null })}
            onOpenMap={() => window.open(routeInfo.url, '_blank')}
        />
      }
      {isScenariosModalOpen && <ScenariosModal scenarios={scenarios} warehouses={warehouses} items={items} users={users} currentUser={currentUser} onUpdateStatus={(scenario, newStatus) => setPendingAction({ scenario, newStatus })} onOpenCreate={() => { setScenariosModalOpen(false); setCreateScenarioModalOpen(true); }} onDelete={handleDeleteScenario} onClose={() => setScenariosModalOpen(false)} onPrint={(scenario) => setScenarioToPrint(scenario)} />}
      {isCreateScenarioModalOpen && <CreateScenarioModal warehouses={warehouses} items={items} users={users} scenarios={scenarios} onCreate={handleCreateScenario} onClose={() => setCreateScenarioModalOpen(false)} />}
      {pendingAction && <ActionConfirmationModal title={pendingAction.newStatus === 'accepted' ? 'Подтверждение принятия' : 'Подтверждение завершения'} onConfirm={handleConfirmActionWithSignature} onCancel={() => setPendingAction(null)} />}
      {pendingWriteOff && <ActionConfirmationModal title="Подтверждение списания" onConfirm={handleConfirmWriteOff} onCancel={() => setPendingWriteOff(null)} />}
      {pendingMove && <ActionConfirmationModal title="Подтверждение перемещения" onConfirm={handleConfirmMove} onCancel={() => setPendingMove(null)} />}
      {isWriteOffModalOpen && <WriteOffModal title="Списать позицию" warehouses={warehouses} items={items} itemTypes={itemTypes} onClose={() => setWriteOffModalOpen(false)} onSelectItem={handleSelectItemToWriteOff} />}
      {isMoveSelectionModalOpen && <WriteOffModal 
        title="Выберите позицию для перемещения"
        warehouses={warehouses} 
        items={items.filter(item => !lockedItemIds.has(item.id))}
        itemTypes={itemTypes} 
        onClose={() => setMoveSelectionModalOpen(false)} 
        onSelectItem={(item) => {
            setItemForAction(item);
            setMoveSelectionModalOpen(false);
        }} 
      />}

      
      {/* --- Print Documents (Hidden) --- */}
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
