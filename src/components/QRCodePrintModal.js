// components/QRCodePrintModal.js
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode';
import { PrintIcon, XIcon } from '../icons';

const LabelsToPrint = React.forwardRef(({ item, user, qrCodeUrl }, ref) => {
  const getLabelCount = () => {
    if (item.size === 'Паллета') return 2;
    if (item.size === 'Коробка') return (item.quantity || 1) * 2;
    return 1;
  };
  const labelCount = getLabelCount();
  const printTime = new Date();
  const formatCode = (code) => code?.length === 8 ? `${code.slice(0, 4)} ${code.slice(4, 8)}` : '';

  return (
    <div ref={ref}>
      <style type="text/css" media="print">{`
        @page { size: 6in 4in landscape; margin: 0; }
        body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .label-container { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; gap: 8px; box-sizing: border-box; padding: 0.2in; page-break-after: always; }
        .label-name { font-size: 24pt; font-weight: bold; margin: 0; }
        .label-type { font-size: 16pt; margin: 0; }
        .label-qr { width: 1.5in; height: 1.5in; margin: 8px 0 4px; }
        .label-unique-code { font-family: monospace; font-size: 20pt; letter-spacing: 0.1em; font-weight: bold; margin: 0; }
        .label-datetime, .label-user { font-size: 10pt; margin: 0; }
      `}</style>
      {Array.from({ length: labelCount }).map((_, i) => (
        <div key={i} className="label-container">
          <h2 className="label-name">{item.name}</h2>
          <p className="label-type">{item.type}</p>
          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="label-qr" />}
          <p className="label-unique-code">{formatCode(item.uniqueCode)}</p>
          <p className="label-datetime">{printTime.toLocaleDateString('ru-RU')} {printTime.toLocaleTimeString('ru-RU')}</p>
          <p className="label-user">{user.firstName} {user.lastName}</p>
        </div>
      ))}
    </div>
  );
});

export default function QRCodePrintModal({ item, user, onClose }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const titleRef = useRef();
  const printComponentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => printComponentRef.current });

  useEffect(() => {
    QRCode.toDataURL(item.id, { width: 256, margin: 2 })
      .then(setQrCodeUrl)
      .catch(console.error);
  }, [item]);

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el || !qrCodeUrl) return;
    let size = 60;
    el.style.fontSize = `${size}px`;
    while ((el.scrollWidth > 256 || el.scrollHeight > size * 2.4) && size > 12) {
      size--;
      el.style.fontSize = `${size}px`;
    }
  }, [qrCodeUrl, item.name]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up">
        <div className="text-center p-4 flex flex-col items-center">
          <h2 ref={titleRef} className="font-bold text-gray-800" style={{ maxWidth: '256px', lineHeight: 1.2 }}>{item.name}</h2>
          <p className="text-xl text-gray-500 mb-4">Тип: {item.type}</p>
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt={`QR-код для ${item.name}`} className="mx-auto" />
          ) : (
            <div style={{ width: 256, height: 256 }} className="bg-gray-200 animate-pulse"></div>
          )}
          {item.uniqueCode && (
            <p className="font-mono text-2xl text-gray-800 mt-4 tracking-widest">
              {item.uniqueCode.slice(0, 4)} {item.uniqueCode.slice(4, 8)}
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
}
