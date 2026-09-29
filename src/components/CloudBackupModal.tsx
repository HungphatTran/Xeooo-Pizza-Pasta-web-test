import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  Cloud,
  Download,
  Upload,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';

interface CloudBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudBackupModal: React.FC<CloudBackupModalProps> = ({ isOpen, onClose }) => {
  const {
    exportDatabaseSnapshot,
    importDatabaseSnapshot,
    resetToDefaultData,
    isOnline,
    offlineQueueCount,
    addToast
  } = useRestaurant();

  const [importJson, setImportJson] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleDownloadSnapshot = () => {
    const dataStr = exportDatabaseSnapshot();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moc_bistro_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Đã tải bản sao lưu', 'File JSON cơ sở dữ liệu đã được lưu về máy', 'success');
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const ok = importDatabaseSnapshot(importJson);
    if (ok) {
      setImportJson('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Sao Lưu Đám Mây & Đồng Bộ Dữ Liệu
              </h3>
              <p className="text-[11px] text-stone-500">
                Tự động lưu trữ snapshot và hỗ trợ làm việc ngoại tuyến (Offline)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Network and Offline Queue status */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              )}
              <div>
                <span className="font-bold block text-stone-900 dark:text-stone-100">
                  {isOnline ? 'Đang kết nối Cloud Server trực tuyến' : 'Đang làm việc ở chế độ Ngoại Tuyến'}
                </span>
                <span className="text-[11px] text-stone-500">
                  {offlineQueueCount > 0
                    ? `Có ${offlineQueueCount} thao tác đang đợi mạng phục hồi để tự động sync`
                    : 'Tất cả dữ liệu đã được đồng bộ hóa tức thì'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {isOnline ? '100% SYNCED' : 'CACHED'}
              </span>
            </div>
          </div>

          {/* Backup Action */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-500" />
              <span>Tải Bản Sao Lưu JSON (Snapshot)</span>
            </h4>
            <p className="text-stone-500">
              Xuất toàn bộ đơn đặt bàn, sơ đồ tầng và đánh giá món ăn thành 1 tệp tin an toàn.
            </p>
            <button
              onClick={handleDownloadSnapshot}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file Snapshot về máy</span>
            </button>
          </div>

          {/* Download Complete Project Source Code ZIP */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              <span>Tải Toàn Bộ Mã Nguồn Website (Full Source Code ZIP)</span>
            </h4>
            <p className="text-stone-500">
              Bao gồm đầy đủ toàn bộ mã nguồn React 19, TypeScript, cấu hình Tailwind CSS, dữ liệu Xéooo Pizza & Pasta để mở trong VS Code hoặc đưa lên hosting riêng.
            </p>
            <a
              href="/xeooo_pizza_pasta_source.zip"
              download="xeooo_pizza_pasta_source.zip"
              className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file ZIP Mã Nguồn (4.5 MB)</span>
            </a>
          </div>

          {/* Restore / Import */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-500" />
              <span>Phục Hồi Dữ Liệu Từ File Sao Lưu</span>
            </h4>
            <textarea
              rows={3}
              placeholder="Dán nội dung JSON sao lưu vào đây để phục hồi..."
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="w-full px-3 py-2 text-[11px] font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
            {importJson && (
              <button
                onClick={handleImport}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bắt đầu phục hồi</span>
              </button>
            )}
          </div>

          {/* Reset to initial realistic data matching image.png */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <button
              onClick={() => setShowConfirmReset(!showConfirmReset)}
              className="text-stone-500 hover:text-red-500 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi phục dữ liệu ban đầu (như ảnh thực tế)</span>
            </button>

            {showConfirmReset && (
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowConfirmReset(false);
                  onClose();
                }}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded transition-colors"
              >
                Xác nhận đặt lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
