import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import 'moment/dist/locale/ru';
import { api } from './Api';
import { RouteConfigurator } from './RouteConfigurator';
import { PalletStats } from './PalletStats';
import { AllWarehousesFreeSpace } from './AllWarehousesFreeSpace';
import { ProfileEditorModal } from './ProfileEditorModal';
import { WarehouseEditor } from './WarehouseEditor';
import { PlacesEditor } from './PlacesEditor';
import { ItemEditor } from './ItemEditor';
import { ItemEditModal } from './ItemEditModal';
import { ItemTypesManager } from './ItemTypesManager';
import { ItemsOnPlaceModal } from './ItemsOnPlaceModal';
import { ContactsModal } from './ContactsModal';
import { UserModerationModal } from './UserModerationModal';
import { LogModal } from './LogModal';
import { WriteOffLogModal } from './WriteOffLogModal';
import { QRScannerModal } from './QRScannerModal';
import { ItemActionModal } from './ItemActionModal';
import { QRCodePrintModal } from './QRCodePrintModal';
import { ScenariosModal } from './ScenariosModal';
import { CreateScenarioModal } from './CreateScenarioModal';
import { ActionConfirmationModal } from './ActionConfirmationModal';
import { WriteOffModal } from './WriteOffModal';
import { CreateNeedModal } from './CreateNeedModal';
import { RequestsListModal } from './RequestsListModal';
import { ScenarioPrintDocument } from './ScenarioPrintDocument';
import { PlusIcon, ArrowLeftIcon, ArrowRightIcon, FilePlusIcon, TruckIcon, RouteIcon, JournalIcon, PrintIcon } from './Icons';

// Set Russian locale for moment.js
moment.locale('ru');

const App = () => {
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
  const [isCreateNeedModalOpen, setCreateNeedModalOpen] = useState(false);
  const [isRequestsListModalOpen, setRequestsListModalOpen] = useState(false);
  const [itemToPrint, setItemToPrint] = useState(null);
  const [scenarioToPrint, setScenarioToPrint] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingWriteOff, setPendingWriteOff] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [isWriteOffModalOpen, setWriteOffModalOpen] = useState(false);
  const [isMoveSelectionModalOpen, setMoveSelectionModalOpen] = useState(false);
  const [activeItemTypeFilter, setActiveItemTypeFilter] = useState('all');
  const [mainViewTab, setMainViewTab] = useState('mainMenu');
  const [expandedWarehouses, setExpandedWarehouses] = useState([]);
  const [viewingPlaceInfo, setViewingPlaceInfo] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ eta: null, loading: false, error: null, url: null });
  const scenarioPrintRef = useRef();

  const addLogEntry = (message, details = {}) => {
    setLog(prev => [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        message,
        details,
      },
      ...prev,
    ]);
  };

  const formatCode = (code) => {
    if (!code || code.length !== 8) return '';
    return `${code.substring(0, 4)} ${code.substring(4, 8)}`;
  };

  const handleStartEditWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse);
  };

  const toggleWarehouseExpansion = (warehouseId) => {
    setExpandedWarehouses(prev =>
      prev.includes(warehouseId)
        ? prev.filter(id => id !== warehouseId)
        : [...prev, warehouseId]
    );
  };

  const sortedWarehouses = [
    { id: 'all', name: 'Все склады' },
    ...warehouses.sort((a, b) => a.name.localeCompare(b.name)),
  ];

  const sortedAndFilteredItemTypes = itemTypes.sort((a, b) => a.name.localeCompare(b.name));
  const sortedAssignedFilteredItems = items
    .filter(item => item.warehouseId !== null)
    .filter(item => activeItemTypeFilter === 'all' || item.type === activeItemTypeFilter)
    .sort((a, b) => a.name.localeCompare(b.name));
  const sortedUnassignedFilteredItems = items
    .filter(item => item.warehouseId === null)
    .filter(item => activeItemTypeFilter === 'all' || item.type === activeItemTypeFilter)
    .sort((a, b) => a.name.localeCompare(b.name));

  const userRole = currentUser?.role || 'Гость';
  const isActionableUser = userRole === 'Администратор' || userRole === 'Кладовщик';
  const lockedItemIds = new Set(
    scenarios
      .filter(s => s.status === 'accepted')
      .flatMap(s => s.items.map(i => i.itemId))
  );

  const viewingPlace = viewingPlaceInfo
    ? warehouses.flatMap(w => w.places || []).find(p => p.id === viewingPlaceInfo)
    : null;
  const itemsOnViewingPlace = viewingPlace
    ? items.filter(i => i.placeId === viewingPlace.id)
    : [];

  const handleSaveWarehouse = (warehouseData) => {
    // Implementation assumed to exist
  };

  const handleSavePlaces = (warehouseId, places) => {
    // Implementation assumed to exist
  };

  const handleResetPlaces = (warehouseId) => {
    // Implementation assumed to exist
  };

  const handleSaveItem = (itemData) => {
    // Implementation assumed to exist
  };

  const handleSaveEditedItem = (itemData) => {
    // Implementation assumed to exist
  };

  const handleSaveItemTypes = (types) => {
    // Implementation assumed to exist
  };

  const handleVerificationSuccess = (item) => {
    // Implementation assumed to exist
  };

  const handleItemActionMove = (item, warehouseId, placeId) => {
    // Implementation assumed to exist
  };

  const handleItemActionWriteOff = (item, reason) => {
    // Implementation assumed to exist
  };

  const handleDeleteScenario = (scenarioId) => {
    // Implementation assumed to exist
  };

  const handleCreateScenario = (scenarioData) => {
    // Implementation assumed to exist
  };

  const handleConfirmActionWithSignature = (signatureData) => {
    // Implementation assumed to exist
  };

  const handleConfirmWriteOff = () => {
    // Implementation assumed to exist
  };

  const handleConfirmMove = () => {
    // Implementation assumed to exist
  };

  const handleSelectItemToWriteOff = (item) => {
    // Implementation assumed to exist
  };

  const handleSaveNeed = (needData) => {
    // Implementation assumed to exist
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await api.loginUser(credentials);
      setCurrentUser(user);
      setAuthChecked(true);
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert('Ошибка входа: ' + error.message);
    }
  };

  const handleRegister = async (userData) => {
    try {
      const newUser = await api.registerUser(userData);
      setCurrentUser(newUser);
      setAuthChecked(true);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      alert('Ошибка регистрации: ' + error.message);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      await api.updateUser(userData);
      setCurrentUser(userData);
      setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
      addLogEntry(`Обновил профиль пользователя: ${userData.firstName} ${userData.lastName}`);
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
      alert('Ошибка обновления пользователя: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      addLogEntry(`Удалил пользователя: ${users.find(u => u.id === userId)?.firstName || ''}`);
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
      alert('Ошибка удаления пользователя: ' + error.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthChecked(false);
    setAuthView('login');
    setWarehouses([]);
    setItems([]);
    setItemTypes([]);
    setScenarios([]);
    setSignatures({});
    setLog([]);
    setWriteOffLog([]);
    setRouteConfig([]);
    setUsers([]);
  };

  useEffect(() => {
    const initializeApp = async () => {
      setAuthChecked(true);
      try {
        const appData = await api.fetchAppData('default-for-registration');
        setWarehouses(appData.warehouses || []);
      } catch (error) {
        console.error("Не удалось загрузить склады для регистрации:", error);
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    const loadDataForUser = async () => {
      if (currentUser && currentUser.role !== 'На модерации') {
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
    if (!currentUser || currentUser.role === 'На модерации') return;

    const intervalId = setInterval(async () => {
      if (isSaving || editingWarehouse || isPlacesEditorOpen || isItemEditorOpen || isItemTypesManagerOpen || itemForAction || isCreateScenarioModalOpen || verifyingItem || editingItem || isScenariosModalOpen) {
        return;
      }

      setIsSaving(true);
      const fullState = { warehouses, items, itemTypes, scenarios, signatures, log, writeOffLog, routeConfig };
      try {
        await api.saveAppData(currentUser.id, fullState);
      } catch (error) {
        console.error("Ошибка при автоматическом сохранении данных:", error);
      } finally {
        setIsSaving(false);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [warehouses, items, itemTypes, scenarios, signatures, log, writeOffLog, routeConfig, currentUser, isSaving]);

  // Render logic (simplified for brevity, assuming other components are defined)
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {warehouses.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 pb-4 mt-4">
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
                      onClick={() => setCreateNeedModalOpen(true)}
                      className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-4"
                    >
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FilePlusIcon /></div>
                      <span className="font-semibold text-gray-700">Создать потребность</span>
                    </button>
                    <button
                      onClick={() => setRequestsListModalOpen(true)}
                      className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-4"
                    >
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><JournalIcon /></div>
                      <span className="font-semibold text-gray-700">Созданные заявки</span>
                    </button>
                    <button
                      onClick={() => setMoveSelectionModalOpen(true)}
                      className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-4"
                    >
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TruckIcon width="18" height="18" /></div>
                      <span className="font-semibold text-gray-700">Переместить/удалить позицию</span>
                    </button>
                    <button
                      onClick={() => setMainViewTab('routeConfig')}
                      className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-4"
                    >
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><RouteIcon /></div>
                      <span className="font-semibold text-gray-700">Настройка маршрута</span>
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
                          );
                        })}
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
                            );
                          })}
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
          {userRole === 'Администратор' && (
            <button onClick={() => setEditingWarehouse({})} className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold transition">
              <PlusIcon /><span className="ml-2">Создать первый склад</span>
            </button>
          )}
        </div>
      )}
      {/* Modals */}
      {isProfileEditorOpen && <ProfileEditorModal user={currentUser} warehouses={warehouses} onSave={handleUpdateUser} onClose={() => setProfileEditorOpen(false)} onLogout={handleLogout} />}
      {editingWarehouse && <WarehouseEditor initialData={editingWarehouse} onSave={handleSaveWarehouse} onCancel={() => setEditingWarehouse(null)} />}
      {isPlacesEditorOpen && warehouses.find(w => w.id === warehouseIdForEditor) && (
        <PlacesEditor
          initialPlaces={warehouses.find(w => w.id === warehouseIdForEditor).places || []}
          onSave={handleSavePlaces}
          onCancel={() => setPlacesEditorOpen(false)}
          onReset={() => handleResetPlaces(warehouseIdForEditor)}
        />
      )}
      {isItemEditorOpen && (
        <ItemEditor
          warehouses={warehouses}
          itemTypes={itemTypes}
          onSave={handleSaveItem}
          onCancel={() => setItemEditorOpen(false)}
          onManageTypes={() => setItemTypesManagerOpen(true)}
          items={items}
          userRole={userRole}
        />
      )}
      {editingItem && <ItemEditModal itemToEdit={editingItem} itemTypes={itemTypes} onSave={handleSaveEditedItem} onCancel={() => setEditingItem(null)} />}
      {isItemTypesManagerOpen && <ItemTypesManager types={itemTypes} onSave={handleSaveItemTypes} onCancel={() => setItemTypesManagerOpen(false)} />}
      {viewingPlaceInfo && viewingPlace && <ItemsOnPlaceModal place={viewingPlace} items={itemsOnViewingPlace} itemTypes={itemTypes} onClose={() => setViewingPlaceInfo(null)} />}
      {isContactsModalOpen && (
        <ContactsModal
          users={users}
          warehouses={warehouses}
          onClose={() => setContactsModalOpen(false)}
          userRole={userRole}
          onOpenModeration={() => { setContactsModalOpen(false); setUserModerationModalOpen(true); }}
        />
      )}
      {isUserModerationModalOpen && (
        <UserModerationModal
          users={users}
          warehouses={warehouses}
          onSave={handleUpdateUser}
          onDelete={handleDeleteUser}
          onClose={() => setUserModerationModalOpen(false)}
          currentUser={currentUser}
        />
      )}
      {isLogModalOpen && userRole === 'Администратор' && <LogModal log={log} users={users} onClose={() => setLogModalOpen(false)} />}
      {isWriteOffLogOpen && userRole === 'Администратор' && <WriteOffLogModal log={writeOffLog} users={users} signatures={signatures} onClose={() => setWriteOffLogOpen(false)} />}
      {verifyingItem && <QRScannerModal itemToVerify={verifyingItem} allItems={items} onSuccess={handleVerificationSuccess} onCancel={() => setVerifyingItem(null)} />}
      {itemForAction && (
        <ItemActionModal
          itemToAction={itemForAction}
          warehouses={warehouses}
          items={items}
          itemTypes={itemTypes}
          onMove={handleItemActionMove}
          onWriteOff={handleItemActionWriteOff}
          onCancel={() => setItemForAction(null)}
        />
      )}
      {itemToPrint && <QRCodePrintModal item={itemToPrint} user={currentUser} onClose={() => setItemToPrint(null)} />}
      {isScenariosModalOpen && (
        <ScenariosModal
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
        />
      )}
      {isCreateScenarioModalOpen && (
        <CreateScenarioModal
          warehouses={warehouses}
          items={items}
          users={users}
          scenarios={scenarios}
          onCreate={handleCreateScenario}
          onClose={() => setCreateScenarioModalOpen(false)}
        />
      )}
      {pendingAction && (
        <ActionConfirmationModal
          title={pendingAction.newStatus === 'accepted' ? 'Подтверждение принятия' : 'Подтверждение завершения'}
          onConfirm={handleConfirmActionWithSignature}
          onCancel={() => setPendingAction(null)}
        />
      )}
      {pendingWriteOff && <ActionConfirmationModal title="Подтверждение списания" onConfirm={handleConfirmWriteOff} onCancel={() => setPendingWriteOff(null)} />}
      {pendingMove && <ActionConfirmationModal title="Подтверждение перемещения" onConfirm={handleConfirmMove} onCancel={() => setPendingMove(null)} />}
      {isWriteOffModalOpen && (
        <WriteOffModal
          title="Списать позицию"
          warehouses={warehouses}
          items={items}
          itemTypes={itemTypes}
          onClose={() => setWriteOffModalOpen(false)}
          onSelectItem={handleSelectItemToWriteOff}
        />
      )}
      {isMoveSelectionModalOpen && (
        <WriteOffModal
          title="Выберите позицию для перемещения"
          warehouses={warehouses}
          items={items.filter(item => !lockedItemIds.has(item.id))}
          itemTypes={itemTypes}
          onClose={() => setMoveSelectionModalOpen(false)}
          onSelectItem={(item) => {
            setItemForAction(item);
            setMoveSelectionModalOpen(false);
          }}
        />
      )}
      {isCreateNeedModalOpen && <CreateNeedModal routeConfig={routeConfig} onSave={handleSaveNeed} onClose={() => setCreateNeedModalOpen(false)} />}
      {isRequestsListModalOpen && <RequestsListModal needs={createdNeeds} routeConfig={routeConfig} onClose={() => setRequestsListModalOpen(false)} />}
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
};

export default App;