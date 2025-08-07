import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode';
import SignatureCanvas from 'react-signature-canvas';

// --- SVG Icons ---
const Icons = {
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
  Trash: ({ width = "24", height = "24" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Truck: ({ width = "24", height = "24" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>,
  Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
  Reset: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Contacts: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect x="3" y="4" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" y1="2" x2="8" y2="4"/><line x1="16" y1="2" x2="16" y2="4"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Scenarios: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  FilePlus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  Print: ({ width = "24", height = "24" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>,
  Journal: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
  Qr: ({ color = "currentColor", width = "18", height = "18" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="14" y1="14" x2="14.01" y2="14"></line><line x1="21" y1="14" x2="21.01" y2="14"></line><line x1="14" y1="21" x2="14.01" y2="21"></line><line x1="21" y1="21" x2="21.01" y2="21"></line></svg>,
  Signature: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8.5"/><path d="m21.1 12.5-6.6 6.6"/><path d="M11 13h3a2 2 0 0 1 2 2v3"/><path d="m15 13 6 6"/><path d="M12.5 21.1 22 11.6"/></svg>,
  MapPin: ({ width = "18", height = "18" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Route: ({ width = "18", height = "18" }) => <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2L12 22"></path><path d="M20 16L12 22L4 16"></path><path d="M4 8L12 2L20 8"></path></svg>,
};

// --- API Configuration ---
const API_BASE_URL = "https://warehouse-vlad.ngrok.io";
const api = {
  request: async (endpoint, method = 'GET', body = null) => {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body && { body: JSON.stringify(body) }),
    };
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      if (!response.ok) throw new Error((await response.json().catch(() => ({ message: response.statusText }))).message || 'Network error');
      return response.json();
    } catch (error) {
      console.error(`Error at ${endpoint}:`, error);
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
};

// --- RouteConfigurator ---
const RouteConfigurator = React.memo(({ initialConfig, onSave, onClose }) => {
  const [places, setPlaces] = useState(initialConfig || []);
  const [expandedPlaceId, setExpandedPlaceId] = useState(null);

  const handleAddPlace = useCallback(() => {
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
  }, [places.length]);

  const handlePlaceChange = useCallback((placeId, field, value) => {
    setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, [field]: value } : p));
  }, []);

  const handleConnectionChange = useCallback((sourceId, targetId, field, value) => {
    setPlaces(prev => prev.map(p => {
      if (p.id !== sourceId) return p;
      const connections = { ...p.connections, [targetId]: { ...p.connections[targetId], [field]: value } };
      if (!connections[targetId].connected) connections[targetId] = { connected: false, distance: '', time: '' };
      return { ...p, connections };
    }));
  }, []);

  const handleDeletePlace = useCallback((placeId) => {
    if (window.confirm('Вы уверены, что хотите удалить это место?')) {
      setPlaces(prev => prev.filter(p => p.id !== placeId));
    }
  }, []);

  const sortedPlaces = useMemo(() => [...places].sort((a, b) => (a.ordinalNumber || 0) - (b.ordinalNumber || 0)), [places]);

  return (
    <div className="p-4 bg-gray-50 rounded-b-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Настройка маршрутов</h3>
        <button onClick={onClose} className="p-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300"><Icons.X /></button>
      </div>
      <div className="space-y-4">
        {sortedPlaces.map(place => (
          <div key={place.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => setExpandedPlaceId(expandedPlaceId === place.id ? null : place.id)}>
              <h4 className="font-bold text-lg text-gray-800">{place.name || 'Новое место'}</h4>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-gray-400">#{place.ordinalNumber}</span>
                {expandedPlaceId === place.id ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
              </div>
            </div>
            {expandedPlaceId === place.id && (
              <div className="p-4 border-t space-y-4 animate-fade-in-up">
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
                          <button onClick={() => handleConnectionChange(place.id, targetPlace.id, 'connected', !connection.connected)} className={`px-3 py-1 rounded-full text-xs font-bold ${connection.connected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
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
                  <button onClick={() => handleDeletePlace(place.id)} className="p-2 text-red-500 hover:text-red-700"><Icons.Trash /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <button onClick={handleAddPlace} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2">
          <Icons.Plus /> Добавить место
        </button>
        <button onClick={() => { onSave(places); alert('Конфигурация маршрута сохранена!'); }} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2">
          <Icons.Save /> Сохранить
        </button>
      </div>
    </div>
  );
});

// --- PalletLines & ShelvingLines ---
const PalletLines = React.memo(({ orientation = 'vertical' }) => {
  const longLineStyle = { position: 'absolute', backgroundColor: 'rgb(255, 249, 230)' };
  const transLineStyle = { position: 'absolute', backgroundColor: 'rgb(245, 191, 93)' };
  const styles = orientation === 'vertical' ? [
    { ...longLineStyle, width: '2px', height: '100%', left: '3px' },
    { ...longLineStyle, width: '2px', height: '100%', left: '7px' },
    { ...longLineStyle, width: '2px', height: '100%', left: '11px' },
    { ...longLineStyle, width: '2px', height: '100%', left: '15px' },
    { ...transLineStyle, height: '3px', width: '100%', top: '0' },
    { ...transLineStyle, height: '3px', width: '100%', top: '50%', transform: 'translateY(-50%)' },
    { ...transLineStyle, height: '3px', width: '100%', bottom: '0' },
  ] : [
    { ...longLineStyle, height: '2px', width: '100%', top: '3px' },
    { ...longLineStyle, height: '2px', width: '100%', top: '7px' },
    { ...longLineStyle, height: '2px', width: '100%', top: '11px' },
    { ...longLineStyle, height: '2px', width: '100%', top: '15px' },
    { ...transLineStyle, width: '3px', height: '100%', left: '0' },
    { ...transLineStyle, width: '3px', height: '100%', left: '50%', transform: 'translateX(-50%)' },
    { ...transLineStyle, width: '3px', height: '100%', right: '0' },
  ];
  return styles.map((style, i) => <div key={i} style={style}></div>);
});

const ShelvingLines = React.memo(({ orientation = 'vertical' }) => {
  const lineStyle = { position: 'absolute', backgroundColor: 'rgb(20, 18, 16)' };
  const styles = orientation === 'vertical' ? [
    { ...lineStyle, height: '2px', width: '100%', top: '0' },
    { ...lineStyle, height: '2px', width: '100%', bottom: '0' },
  ] : [
    { ...lineStyle, width: '2px', height: '100%', left: '0' },
    { ...lineStyle, width: '2px', height: '100%', right: '0' },
  ];
  return styles.map((style, i) => <div key={i} style={style}></div>);
});

// --- PalletStats ---
const PalletStats = React.memo(({ places = [], items = [] }) => {
  const palletPlaces = useMemo(() => places.filter(p => p.type === 'pallet'), [places]);
  const totalPalletPlaces = palletPlaces.length;
  if (!totalPalletPlaces) return <p className="mt-2 text-sm text-center text-gray-500">Паллетные места не сконфигурированы</p>;

  const occupiedPalletPlaceIds = useMemo(() => new Set(items.filter(item => palletPlaces.some(p => p.id === item.placeId)).map(item => item.placeId)), [items, palletPlaces]);
  const freePalletPlacesCount = totalPalletPlaces - occupiedPalletPlaceIds.size;

  return (
    <div className="mt-2 text-sm text-gray-600 space-y-1">
      <div className="flex justify-between"><span>Всего паллетных мест:</span><span className="font-semibold text-gray-800">{totalPalletPlaces}</span></div>
      <div className="flex justify-between"><span>Свободных мест:</span><span className="font-semibold text-green-600">{freePalletPlacesCount}</span></div>
    </div>
  );
});

// --- PalletCapacityScale ---
const PalletCapacityScale = React.memo(({ places = [], items = [] }) => {
  const palletPlaces = useMemo(() => places.filter(p => p.type === 'pallet'), [places]);
  const totalPalletPlaces = palletPlaces.length;
  if (!totalPalletPlaces) return null;

  const occupiedPalletPlaceIds = useMemo(() => new Set(items.filter(item => item.placeId !== null && palletPlaces.some(p => p.id === item.placeId)).map(item => item.placeId)), [items, palletPlaces]);
  const dots = Array.from({ length: totalPalletPlaces }, (_, i) => (
    <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: i < occupiedPalletPlaceIds.size ? '#ef4444' : '#d1d5db', margin: '1px' }}></div>
  ));

  return (
    <div className="mt-2">
      <p className="text-xs text-gray-500 mb-1">Заполненность паллетных мест:</p>
      <div className="flex flex-wrap -m-px">{dots}</div>
    </div>
  );
});

// --- AllWarehousesFreeSpace ---
const AllWarehousesFreeSpace = React.memo(({ warehouses = [], items = [] }) => {
  const freeSpacesByWarehouse = useMemo(() => warehouses
    .filter(w => w.id !== 'all')
    .map(warehouse => {
      const palletPlaces = (warehouse.places || []).filter(p => p.type === 'pallet');
      const totalPalletPlaces = palletPlaces.length;
      if (!totalPalletPlaces) return null;
      const occupiedPalletPlaceIds = new Set(items.filter(item => item.warehouseId === warehouse.id && item.placeId !== null && palletPlaces.some(p => p.id === item.placeId)).map(item => item.placeId));
      return { id: warehouse.id, name: warehouse.name, free: totalPalletPlaces - occupiedPalletPlaceIds.size };
    })
    .filter(Boolean), [warehouses, items]);

  if (!freeSpacesByWarehouse.length) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-md font-semibold text-gray-700 mb-2">Свободные места</h4>
      <div className="space-y-1 text-sm">
        {freeSpacesByWarehouse.map(w => (
          <div key={w.id} className="flex justify-between"><span className="text-gray-600">{w.name}:</span><span className="font-bold text-gray-800">{w.free}</span></div>
        ))}
      </div>
    </div>
  );
});

// --- LabelsToPrint ---
const LabelsToPrint = React.forwardRef(({ item, user, qrCodeUrl }, ref) => {
  const labelCount = useMemo(() => item.size === 'Паллета' ? 2 : item.size === 'Коробка' ? (item.quantity || 1) * 2 : 1, [item]);
  const printTime = new Date();
  const formatCode = useCallback(code => code?.length === 8 ? `${code.substring(0, 4)} ${code.substring(4, 8)}` : '', []);

  return (
    <div ref={ref}>
      <style type="text/css" media="print">{`
        @page { size: 6in 4in landscape; margin: 0; }
        body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .label-container { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; gap: 8px; box-sizing: border-box; padding: 0.2in; page-break-after: always; }
        .label-name { font-size: 24pt; font-weight: bold; margin: 0; }
        .label-type { font-size: 16pt; margin: 0; }
        .label-qr { width: 1.5in; height: 1.5in; margin-top: 8px; margin-bottom: 4px; }
        .label-unique-code { font-family: monospace; font-size: 20pt; letter-spacing: 0.1em; font-weight: bold; margin: 0; }
        .label-datetime, .label-user { font-size: 10pt; margin: 0; }
      `}</style>
      {Array.from({ length: labelCount }).map((_, i) => (
        <div key={i} className="label-container">
          <h2 className="label-name">{item.name}</h2>
          <p className="label-type">{item.type}</p>
          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="label-qr" />}
          <p className="label-unique-code">{formatCode(item.uniqueCode)}</p>
          <p className="label-datetime">{printTime.toLocaleDateString('ru-RU')} &nbsp; {printTime.toLocaleTimeString('ru-RU')}</p>
          <p className="label-user">{user.firstName} {user.lastName}</p>
        </div>
      ))}
    </div>
  );
});

// --- QRCodePrintModal ---
const QRCodePrintModal = React.memo(({ item, user, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const qrCodePreviewRef = useRef();
  const printComponentRef = useRef();
  const titleRef = useRef();

  const handlePrint = useReactToPrint({ content: () => printComponentRef.current, documentTitle: `Labels-${item.name}` });

  useEffect(() => {
    QRCode.toDataURL(item.id, { width: 256, margin: 2 }).then(setQrCodeUrl).catch(err => console.error('QR code generation failed:', err));
  }, [item.id]);

  useLayoutEffect(() => {
    if (!titleRef.current || !qrCodeUrl) return;
    const element = titleRef.current;
    const MAX_WIDTH = 256, MIN_FONT_SIZE = 12, START_FONT_SIZE = 60;
    let currentFontSize = START_FONT_SIZE;
    element.style.fontSize = `${currentFontSize}px`;
    element.style.wordWrap = 'break-word';
    while ((element.scrollWidth > MAX_WIDTH || element.scrollHeight > currentFontSize * 2.4) && currentFontSize > MIN_FONT_SIZE) {
      element.style.fontSize = `${--currentFontSize}px`;
    }
  }, [item.name, qrCodeUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up">
        <div ref={qrCodePreviewRef} className="text-center p-4 flex flex-col items-center">
          <h2 ref={titleRef} className="font-bold text-gray-800" style={{ maxWidth: '256px', lineHeight: 1.2 }}>{item.name}</h2>
          <p className="text-xl text-gray-500 mb-4">Тип: {item.type}</p>
          {qrCodeUrl ? <img src={qrCodeUrl} alt={`QR-код для ${item.name}`} className="mx-auto" /> : <div style={{ width: '256px', height: '256px' }} className="bg-gray-200 animate-pulse mx-auto"></div>}
          {item.uniqueCode && <p className="font-mono text-2xl text-gray-800 mt-4 tracking-widest">{item.uniqueCode.substring(0, 4)} {item.uniqueCode.substring(4, 8)}</p>}
          <div className="text-xs text-gray-500 mt-4">
            <p>Дата печати: {new Date().toLocaleString('ru-RU')}</p>
            <p>Пользователь: {user.firstName} {user.lastName}</p>
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Закрыть</button>
          <button onClick={handlePrint} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold flex items-center gap-2"><Icons.Print /> Печать</button>
        </div>
        <div style={{ display: 'none' }}><LabelsToPrint ref={printComponentRef} item={item} user={user} qrCodeUrl={qrCodeUrl} /></div>
      </div>
    </div>
  );
});

// --- ProfileEditorModal ---
const ProfileEditorModal = React.memo(({ user, warehouses, onSave, onClose, onLogout }) => {
  const [userData, setUserData] = useState({ ...user });
  const handleChange = useCallback(e => setUserData(prev => ({ ...prev, [e.target.name]: e.target.value })), []);
  const handleSave = useCallback(() => { onSave(userData); onClose(); }, [userData, onSave, onClose]);

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
          <button onClick={onLogout} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 font-semibold transition"><Icons.LogOut /><span>Выйти</span></button>
          <div className="flex space-x-4">
            <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
            <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  );
});

// --- WarehouseEditor ---
const WarehouseEditor = React.memo(({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', address: '', hours: '', gate_code: '', lock_code: '', ...initialData });
  const handleChange = useCallback(e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })), []);
  const handleSave = useCallback(() => {
    if (!formData.name || !formData.address) return alert('Наименование и адрес склада обязательны для заполнения.');
    onSave(formData);
  }, [formData, onSave]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Данные о складе</h2>
        <div className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Наименование склада" className="w-full p-3 border rounded-lg" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Адрес склада" className="w-full p-3 border rounded-lg" />
          <input type="text" name="hours" value={formData.hours} onChange={handleChange} placeholder="Часы работы склада" className="w-full p-3 border rounded-lg" />
          <input type="text" name="gate_code" value={formData.gate_code} onChange={handleChange} placeholder="Код ворот" className="w-full p-3 border rounded-lg" />
          <input type="text" name="lock_code" value={formData.lock_code} onChange={handleChange} placeholder="Код замка" className="w-full p-3 border rounded-lg" />
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить</button>
        </div>
      </div>
    </div>
  );
});

// --- PlacesEditor ---
const PlacesEditor = React.memo(({ initialPlaces, onSave, onCancel, onReset }) => {
  const [placeStates, setPlaceStates] = useState(() => {
    const states = Array(49).fill(0);
    initialPlaces.forEach(p => { states[p.id] = p.type === 'pallet' ? (p.orientation === '30*36' ? 1 : 2) : (p.orientation === '40*15' ? 3 : 4); });
    return states;
  });

  const handleButtonClick = useCallback(id => setPlaceStates(prev => { const newStates = [...prev]; newStates[id] = (newStates[id] + 1) % 5; return newStates; }), []);
  const handleSave = useCallback(() => {
    const selectedPlaces = placeStates.reduce((acc, state, id) => {
      if (state === 1) acc.push({ id, type: 'pallet', orientation: '30*36' });
      else if (state === 2) acc.push({ id, type: 'pallet', orientation: '36*30' });
      else if (state === 3) acc.push({ id, type: 'shelving', orientation: '40*15' });
      else if (state === 4) acc.push({ id, type: 'shelving', orientation: '15*40' });
      return acc;
    }, []);
    onSave(selectedPlaces);
  }, [onSave, placeStates]);

  const getButtonStyle = useCallback(state => {
    const style = { width: '30px', height: '36px', backgroundColor: '#d1d5db', position: 'relative', overflow: 'hidden' };
    const className = 'flex-shrink-0 transition-all duration-200 ease-in-out';
    if (state === 1) style.backgroundColor = 'rgb(245, 192, 93)';
    else if (state === 2) { style.backgroundColor = 'rgb(245, 192, 93)'; style.width = '36px'; style.height = '30px'; }
    else if (state === 3) { style.backgroundColor = 'rgb(84, 73, 61)'; style.width = '40px'; style.height = '15px'; }
    else if (state === 4) { style.backgroundColor = 'rgb(84, 73, 61)'; style.width = '15px'; style.height = '40px'; }
    return { className, style };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up my-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Редактирование мест</h2>
        <div style={{ borderTop: '5px solid black', borderLeft: '5px solid black', borderRight: '5px solid black', padding: '4px', width: 'fit-content', margin: '0 auto' }}>
          <div className="grid grid-cols-7" style={{ gap: '3px' }}>
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
          <button onClick={onCancel} className="flex items-center justify-center w-16 h-16 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 font-semibold transition-all shadow-md hover:shadow-lg" aria-label="Отмена"><Icons.X /></button>
          <button onClick={onReset} className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-yellow-500 hover:bg-yellow-600 font-semibold transition-all shadow-md hover:shadow-lg" aria-label="Сброс"><Icons.Reset /></button>
          <button onClick={handleSave} className="flex items-center justify-center w-16 h-16 rounded-full text-white bg-blue-600 hover:bg-blue-700 font-semibold transition-all shadow-md hover:shadow-lg" aria-label="Сохранить"><Icons.Save /></button>
        </div>
      </div>
    </div>
  );
});

// --- CompactPlacesGrid ---
const CompactPlacesGrid = React.memo(({ places, items = [], onPlaceSelect, selectedPlaceInfo, disabledPlaces = [], itemTypes, warehouseId }) => {
  const { activeRows, activeCols } = useMemo(() => {
    const rows = new Set(), cols = new Set();
    places.forEach(p => { rows.add(Math.floor(p.id / 7)); cols.add(p.id % 7); });
    return { activeRows: Array.from(rows).sort((a, b) => a - b), activeCols: Array.from(cols).sort((a, b) => a - b) };
  }, [places]);

  return (
    <div className="flex flex-col p-1" style={{ width: 'fit-content', backgroundColor: '#f9fafb', borderTop: '3px solid black', borderLeft: '3px solid black', borderRight: '3px solid black' }}>
      {activeRows.map(row => (
        <div key={row} className="flex">
          {activeCols.map(col => {
            const id = row * 7 + col, place = places.find(p => p.id === id);
            let style = { width: '20px', height: '24px', position: 'relative', overflow: 'hidden' }, backgroundColor = 'transparent';
            const isDisabled = disabledPlaces.includes(id), isSelected = selectedPlaceInfo?.placeId === id && selectedPlaceInfo?.warehouseId === warehouseId;
            const itemsOnThisPlace = place ? items.filter(item => item.placeId === id) : [];
            const isClickable = place && (onPlaceSelect ? !isDisabled : itemsOnThisPlace.length > 0);

            if (place) {
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

            return (
              <div key={col} className="flex items-center justify-center" style={{ width: '30px', height: '30px', margin: '1.5px' }}>
                <div onClick={() => isClickable && onPlaceSelect({ placeId: id, warehouseId })} className={`rounded-sm flex items-center justify-center gap-1 ${isClickable ? 'cursor-pointer' : ''} ${isDisabled ? 'opacity-30' : ''} ${isSelected ? 'ring-2 ring-offset-1 ring-red-500' : ''}`} style={{ ...style, backgroundColor }}>
                  {place?.type === 'pallet' && !itemsOnThisPlace.length && <PalletLines orientation={place.orientation === '30*36' ? 'vertical' : 'horizontal'} />}
                  {place?.type === 'shelving' && <ShelvingLines orientation={place.orientation === '15*40' ? 'vertical' : 'horizontal'} />}
                  {place?.type === 'pallet' && itemsOnThisPlace.map(item => (
                    <div key={item.id} style={{ width: '16px', height: '16px', backgroundColor: itemTypes.find(it => it.name === item.type)?.color || '#ccc', flexShrink: 0 }} className="rounded-sm"></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});

// --- ItemEditor ---
const ItemEditor = React.memo(({ warehouses, itemTypes, onSave, onCancel, onManageTypes, items, userRole }) => {
  const [newItem, setNewItem] = useState({ name: '', type: itemTypes[0]?.name || '', size: 'Паллета', quantity: 1, warehouseId: warehouses[0]?.id || null, placeId: null });
  const [disabledPlaces, setDisabledPlaces] = useState([]);

  useEffect(() => {
    if (!newItem.warehouseId && warehouses.length) setNewItem(prev => ({ ...prev, warehouseId: warehouses[0].id }));
  }, [warehouses, newItem.warehouseId]);

  useEffect(() => {
    if (!newItem.warehouseId || !newItem.size) return;
    const selectedWarehouse = warehouses.find(w => w.id === newItem.warehouseId);
    if (!selectedWarehouse) return;
    const newDisabledPlaces = (selectedWarehouse.places || []).filter(place => {
      const itemsOnPlace = items.filter(i => i.placeId === place.id && i.warehouseId === newItem.warehouseId);
      return newItem.size === 'Паллета' && (place.type === 'shelving' || (place.type === 'pallet' && itemsOnPlace.filter(i => i.size === 'Паллета').length >= 2));
    }).map(place => place.id);
    setDisabledPlaces(newDisabledPlaces);
  }, [newItem.warehouseId, newItem.size, warehouses, items]);

  const handleChange = useCallback(e => setNewItem(prev => ({ ...prev, [e.target.name]: e.target.value, ...(e.target.name === 'warehouseId' && { placeId: null }) })), []);
  const handleSave = useCallback(() => {
    if (!newItem.name || !newItem.type || !newItem.size || !newItem.quantity || !newItem.warehouseId || newItem.placeId === null) return alert('Пожалуйста, заполните все поля и выберите место.');
    onSave({ ...newItem, id: crypto.randomUUID() });
  }, [newItem, onSave]);

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
              {userRole === 'Администратор' && <button onClick={onManageTypes} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"><Icons.Edit /></button>}
            </div>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {itemTypes.map(t => (
                <button key={t.id} onClick={() => setNewItem(prev => ({ ...prev, type: t.name }))} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-full transition-all ${newItem.type === t.name ? 'ring-2 ring-offset-1' : ''}`} style={{ backgroundColor: newItem.type === t.name ? t.color : '#e5e7eb', color: newItem.type === t.name ? 'white' : '#374151', borderColor: t.color }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'white', opacity: newItem.type === t.name ? 1 : 0.5 }}></div>
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
              <h3 className="font-semibold text-gray-700 mb-2">Выберите место:</h3>
              <CompactPlacesGrid places={selectedWarehouse.places || []} items={items} onPlaceSelect={place => setNewItem(prev => ({ ...prev, placeId: place.placeId }))} selectedPlaceInfo={{ placeId: newItem.placeId, warehouseId: newItem.warehouseId }} disabledPlaces={disabledPlaces} itemTypes={itemTypes} warehouseId={newItem.warehouseId} />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Отмена</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Сохранить</button>
        </div>
      </div>
    </div>
  );
});

// --- App Component ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [signatures, setSignatures] = useState({});
  const [log, setLog] = useState([]);
  const [writeOffLog, setWriteOffLog] = useState([]);
  const [routeConfig, setRouteConfig] = useState([]);
  const [createdNeeds, setCreatedNeeds] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [isPlacesEditorOpen, setPlacesEditorOpen] = useState(false);
  const [warehouseIdForEditor, setWarehouseIdForEditor] = useState(null);
  const [isItemEditorOpen, setItemEditorOpen] = useState(false);
  const [isItemTypesManagerOpen, setItemTypesManagerOpen] = useState(false);
  const [itemForAction, setItemForAction] = useState(null);
  const [isCreateScenarioModalOpen, setCreateScenarioModalOpen] = useState(false);
  const [verifyingItem, setVerifyingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isScenariosModalOpen, setScenariosModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileEditorOpen, setProfileEditorOpen] = useState(false);
  const [isContactsModalOpen, setContactsModalOpen] = useState(false);
  const [isUserModerationModalOpen, setUserModerationModalOpen] = useState(false);
  const [isLogModalOpen, setLogModalOpen] = useState(false);
  const [isWriteOffLogOpen, setWriteOffLogOpen] = useState(false);
  const [qrScanPurpose, setQrScanPurpose] = useState('action');
  const [itemToPrint, setItemToPrint] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingWriteOff, setPendingWriteOff] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [isWriteOffModalOpen, setWriteOffModalOpen] = useState(false);
  const [isMoveSelectionModalOpen, setMoveSelectionModalOpen] = useState(false);
  const [isCreateNeedModalOpen, setCreateNeedModalOpen] = useState(false);
  const [isRequestsListModalOpen, setRequestsListModalOpen] = useState(false);
  const [scenarioToPrint, setScenarioToPrint] = useState(null);
  const [mainViewTab, setMainViewTab] = useState('mainMenu');
  const [expandedWarehouses, setExpandedWarehouses] = useState([]);
  const [activeItemTypeFilter, setActiveItemTypeFilter] = useState('all');
  const [viewingPlaceInfo, setViewingPlaceInfo] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const headerRef = useRef();
  const actionsMenuRef = useRef();
  const scenarioPrintRef = useRef();
  const hasLoadedData = useRef(false);
  const SESSION_STORAGE_KEY = 'warehouse-session';

  const generateUniqueCode = useCallback(items => {
    const existingCodes = new Set(items.map(item => item.uniqueCode).filter(Boolean));
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    do { code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''); } while (existingCodes.has(code));
    return code;
  }, []);

  const addLogEntry = useCallback((message, details) => {
    setLog(prev => [{ id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId: currentUser.id, message, details }, ...prev]);
  }, [currentUser]);

  useEffect(() => {
    const initializeApp = async () => {
      let sessionUser = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
      if (sessionUser) {
        try {
          const response = await api.request(`/users/${sessionUser.id}`);
          if (!response || response.status === 'На модерации') {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            sessionUser = null;
          }
        } catch (error) {
          console.error("Session check failed:", error);
          localStorage.removeItem(SESSION_STORAGE_KEY);
          sessionUser = null;
        }
      }
      setAuthChecked(true);
      if (sessionUser) {
        setCurrentUser(sessionUser);
      } else {
        try {
          const appData = await api.request('/data/for-registration');
          setWarehouses(appData.warehouses || []);
        } catch (error) {
          console.error("Failed to load warehouses for registration:", error);
        }
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (!currentUser || currentUser.role === 'На модерации' || hasLoadedData.current) return;
    const loadDataForUser = async () => {
      setLoading(true);
      try {
        const [appData, usersData] = await Promise.all([api.fetchAppData(currentUser.id), api.fetchUsers()]);
        let loadedItems = appData.items || [];
        if (loadedItems.some(item => !item.uniqueCode)) {
          const existingCodes = new Set(loadedItems.map(item => item.uniqueCode).filter(Boolean));
          loadedItems = loadedItems.map(item => item.uniqueCode ? item : { ...item, uniqueCode: generateUniqueCode(loadedItems) });
        }
        setWarehouses(appData.warehouses || []);
        setItems(loadedItems);
        setItemTypes(appData.itemTypes || []);
        setScenarios(appData.scenarios || []);
        setSignatures(appData.signatures || {});
        setLog(appData.log || []);
        setWriteOffLog(appData.writeOffLog || []);
        setRouteConfig(appData.routeConfig || []);
        setCreatedNeeds(appData.createdNeeds || []);
        setUsers(usersData || []);
        hasLoadedData.current = true;
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDataForUser();
  }, [currentUser, generateUniqueCode]);

  useEffect(() => {
    if (!hasLoadedData.current || !currentUser || loading) return;
    setIsSaving(true);
    api.saveAppData(currentUser.id, { warehouses, items, itemTypes, scenarios, signatures, log, writeOffLog, routeConfig, createdNeeds })
      .catch(error => console.error("Auto-save failed:", error))
      .finally(() => setIsSaving(false));
  }, [warehouses, items, itemTypes, scenarios, signatures, log, writeOffLog, routeConfig, createdNeeds, currentUser, loading]);

  useEffect(() => {
    if (!currentUser || currentUser.role === 'На модерации') return;
    const intervalId = setInterval(async () => {
      if (isSaving || editingWarehouse || isPlacesEditorOpen || isItemEditorOpen || isItemTypesManagerOpen || itemForAction || isCreateScenarioModalOpen || verifyingItem || editingItem || isScenariosModalOpen) return;
      try {
        const [newData, newUsers] = await Promise.all([api.fetchAppData(currentUser.id), api.fetchUsers()]);
        if (JSON.stringify(newData) !== JSON.stringify({ warehouses, items, itemTypes, scenarios, signatures, log, writeOffLog, routeConfig, createdNeeds })) {
          setWarehouses(newData.warehouses || []);
          setItems(newData.items || []);
          setItemTypes(newData.itemTypes || []);
          setScenarios(newData.scenarios || []);
          setSignatures(newData.signatures || {});
          setLog(newData.log || []);
          setWriteOffLog(newData.writeOffLog || []);
          setRouteConfig(newData.routeConfig || []);
          setCreatedNeeds(newData.createdNeeds || []);
        }
        if (JSON.stringify(newUsers) !== JSON.stringify(users)) setUsers(newUsers || []);
      } catch (error) {
        console.error("Background data update failed:", error);
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [currentUser, isSaving, editingWarehouse, isPlacesEditorOpen, isItemEditorOpen, isItemTypesManagerOpen, itemForAction, isCreateScenarioModalOpen, verifyingItem, editingItem, isScenariosModalOpen, warehouses, items, itemTypes, scenarios, signatures, log, writeOffLog, routeConfig, createdNeeds, users]);

  const handleSaveWarehouse = useCallback(data => {
    const isNew = !data.id;
    const savedData = { ...data, id: data.id || crypto.randomUUID() };
    setWarehouses(prev => prev.some(w => w.id === savedData.id) ? prev.map(w => w.id === savedData.id ? { ...w, ...savedData } : w) : [...prev, { ...savedData, places: [] }]);
    addLogEntry(isNew ? `Создал склад: ${savedData.name}` : `Отредактировал склад ${savedData.name}`, isNew ? null : { before: warehouses.find(w => w.id === savedData.id), after: savedData });
    setEditingWarehouse(null);
  }, [addLogEntry, warehouses]);

  const handleSavePlaces = useCallback(placesData => {
    setWarehouses(prev => prev.map(w => w.id === warehouseIdForEditor ? { ...w, places: placesData } : w));
    addLogEntry(`Отредактировал места на складе: ${warehouses.find(w => w.id === warehouseIdForEditor)?.name}`);
    setPlacesEditorOpen(false);
  }, [addLogEntry, warehouseIdForEditor, warehouses]);

  const handleSaveItem = useCallback(itemData => {
    const newItem = { ...itemData, uniqueCode: generateUniqueCode(items) };
    setItems(prev => [...prev, newItem]);
    addLogEntry(`Создал позицию: ${newItem.name}`);
    setItemEditorOpen(false);
  }, [addLogEntry, generateUniqueCode, items]);

  const handleSaveItemTypes = useCallback(types => {
    setItemTypes(types);
    addLogEntry('Отредактировал типы позиций');
    setItemTypesManagerOpen(false);
  }, [addLogEntry]);

  const handleSaveEditedItem = useCallback(updatedItem => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    addLogEntry(`Отредактировал позицию '${updatedItem.name}'`, { before: items.find(item => item.id === updatedItem.id), after: updatedItem });
    setEditingItem(null);
  }, [addLogEntry, items]);

  const handleItemActionMove = useCallback(({ destination, quantity, unit }) => {
    if (currentUser.role === 'Водитель') {
      setPendingMove({ item: itemForAction, destination, quantity, unit });
      setItemForAction(null);
      return;
    }
    const originalItem = items.find(item => item.id === itemForAction.id);
    if (!originalItem) return;
    setItems(prevItems => {
      if (quantity >= originalItem.quantity) {
        return prevItems.map(item => item.id === itemForAction.id ? { ...item, warehouseId: destination.warehouseId, placeId: destination.placeId, size: unit } : item);
      }
      const updatedOriginalItem = { ...originalItem, quantity: originalItem.quantity - quantity };
      const newItem = { ...originalItem, id: crypto.randomUUID(), quantity, warehouseId: destination.warehouseId, placeId: destination.placeId, size: unit };
      return [...prevItems.map(item => item.id === itemForAction.id ? updatedOriginalItem : item), newItem];
    });
    addLogEntry(`Разделил и переместил ${quantity} ${unit} '${originalItem.name}' из '${warehouses.find(w => w.id === originalItem.warehouseId)?.name || 'Нераспределенные'}' в '${warehouses.find(w => w.id === destination.warehouseId)?.name}'`);
    setItemForAction(null);
  }, [addLogEntry, currentUser.role, itemForAction, items, warehouses]);

  const handleConfirmMove = useCallback(signatureData => {
    if (!pendingMove) return;
    const { item, destination, quantity, unit } = pendingMove;
    const signatureId = `sig_${crypto.randomUUID()}`;
    setSignatures(prev => ({ ...prev, [signatureId]: signatureData }));
    setItems(prevItems => {
      const originalItem = prevItems.find(i => i.id === item.id);
      if (!originalItem) return prevItems;
      if (quantity >= originalItem.quantity) {
        return prevItems.map(i => i.id === item.id ? { ...i, warehouseId: destination.warehouseId, placeId: destination.placeId, size: unit } : i);
      }
      const updatedOriginalItem = { ...originalItem, quantity: originalItem.quantity - quantity };
      const newItem = { ...originalItem, id: crypto.randomUUID(), quantity, warehouseId: destination.warehouseId, placeId: destination.placeId, size: unit };
      return [...prevItems.map(i => i.id === item.id ? updatedOriginalItem : i), newItem];
    });
    addLogEntry(`Водитель переместил ${quantity} ${unit} '${item.name}' из '${warehouses.find(w => w.id === item.warehouseId)?.name || 'Нераспределенные'}' в '${ware