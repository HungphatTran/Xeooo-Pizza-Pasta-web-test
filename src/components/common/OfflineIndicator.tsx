import React from 'react';
import { useUI } from '../../context/UIContext';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useUI();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Đang ngoại tuyến — Hệ thống đang lưu tạm vào bộ nhớ thiết bị.</span>
    </div>
  );
};
