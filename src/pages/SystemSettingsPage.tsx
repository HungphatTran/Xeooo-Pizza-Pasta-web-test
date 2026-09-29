import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StorageService } from '../services/storageService';
import { ApiDocsModal } from '../components/common/ApiDocsModal';
import {
  Settings,
  Database,
  Download,
  Upload,
  RefreshCw,
  Sun,
  Moon,
  Globe,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  MessageSquarePlus,
  GitCommit,
  Code2,
  Check,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    language,
    setLanguage,
    startOnboardingTour,
    exportDatabaseSnapshot,
    importDatabaseSnapshot,
    resetToDefaultData,
    addToast,
  } = useRestaurant();

  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  const handleExportJSON = () => {
    const jsonStr = exportDatabaseSnapshot();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xeooo_restaurant_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Sao lưu thành công', 'Đã tải xuống file bản sao lưu JSON toàn bộ dữ liệu.', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importDatabaseSnapshot(content);
      if (ok) {
        addToast('Phục hồi thành công', 'Đã khôi phục toàn bộ dữ liệu từ file sao lưu.', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        addToast('Lỗi file sao lưu', 'Định dạng file sao lưu không hợp lệ.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ thay đổi và đưa dữ liệu về trạng thái ban đầu của quán. Bạn có chắc chắn?')) {
      resetToDefaultData();
      addToast('Khôi phục mặc định', 'Đã đặt lại dữ liệu ban đầu.', 'info');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-500" />
            <span>Cài Đặt Hệ Thống, Sao Lưu &amp; Tùy Biến Giao Diện</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình giao diện tối/sáng, đa ngôn ngữ VN/EN, sao lưu &amp; phục hồi đám mây, OpenAPI docs và hướng dẫn sử dụng
          </p>
        </div>
      </div>

      {/* Grid Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Card 1: Appearance & Localization */}
        <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-5">
          <div className="flex items-center gap-2.5 font-bold text-sm text-stone-900 dark:text-stone-100">
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Giao Diện &amp; Ngôn Ngữ</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200 block">Chế Độ Tối (Dark Mode)</span>
                <span className="text-stone-500 text-[11px]">Tối ưu cho không gian ấm cúng lãng mạn ban đêm</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  isDarkMode ? 'bg-amber-500' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    isDarkMode ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3">
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200 block">Ngôn Ngữ Hiển Thị</span>
                <span className="text-stone-500 text-[11px]">Chuyển đổi giao diện song ngữ Tiếng Việt &amp; English</span>
              </div>
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                <button
                  onClick={() => setLanguage('vi')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                    language === 'vi' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                    language === 'en' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Guided Tour & Developer Docs */}
        <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-5">
          <div className="flex items-center gap-2.5 font-bold text-sm text-stone-900 dark:text-stone-100">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>Trợ Giúp &amp; Tài Liệu Tích Hợp</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={startOnboardingTour}
              className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-amber-500 bg-stone-50 dark:bg-stone-800/40 text-stone-800 dark:text-stone-200 font-semibold flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Khởi Chạy Tour Hướng Dẫn Từng Bước</span>
              </div>
              <span className="text-[11px] text-amber-500 font-normal">Bắt đầu</span>
            </button>

            <button
              onClick={() => setIsApiDocsOpen(true)}
              className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-amber-500 bg-stone-50 dark:bg-stone-800/40 text-stone-800 dark:text-stone-200 font-semibold flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-emerald-500" />
                <span>Tài Liệu Kỹ Thuật API (OpenAPI / Swagger)</span>
              </div>
              <span className="text-[11px] text-emerald-500 font-normal">Xem JSON</span>
            </button>

            <button
              onClick={() => setIsChangelogOpen(true)}
              className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-amber-500 bg-stone-50 dark:bg-stone-800/40 text-stone-800 dark:text-stone-200 font-semibold flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <GitCommit className="w-4 h-4 text-blue-500" />
                <span>Nhật Ký Phiên Bản (Changelog v4.0)</span>
              </div>
              <span className="text-[11px] text-blue-500 font-normal">Chi tiết</span>
            </button>
          </div>
        </div>

        {/* Card 3: Backup & Restore */}
        <div className="md:col-span-2 p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-bold text-sm text-stone-900 dark:text-stone-100">
              <Database className="w-5 h-5 text-amber-500" />
              <span>Sao Lưu Toàn Bộ Dữ Liệu &amp; Phục Hồi (JSON Backup &amp; Restore)</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold">
              Auto-Synced
            </span>
          </div>

          <p className="text-stone-500 leading-relaxed text-xs">
            Bảo đảm an toàn tuyệt đối cho toàn bộ lịch đặt bàn, sơ đồ bàn, menu, doanh thu, đơn bếp KDS và danh sách khách hàng. Bạn có thể xuất bản sao lưu ra máy tính hoặc phục hồi khi đổi thiết bị.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs hover:bg-amber-400 flex items-center gap-2 shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Tải Bản Sao Lưu JSON Về Máy</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs flex items-center gap-2 cursor-pointer transition">
              <Upload className="w-4 h-4 text-amber-500" />
              <span>Phục Hồi Dữ Liệu Từ File JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleResetData}
              className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-semibold text-xs flex items-center gap-2 transition ml-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Khôi Phục Dữ Liệu Mẫu Của Quán</span>
            </button>
          </div>
        </div>
      </div>

      {/* OpenAPI Modal */}
      <ApiDocsModal isOpen={isApiDocsOpen} onClose={() => setIsApiDocsOpen(false)} />

      {/* Changelog Modal */}
      {isChangelogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Nhật Ký Phiên Bản Xéooo POS v4.0.0 Enterprise
            </h3>
            <div className="space-y-2 text-stone-600 dark:text-stone-300 max-h-64 overflow-y-auto pr-1">
              <div className="font-bold text-amber-500">✨ Các Tính Năng Đột Phá Đã Hoàn Thiện:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Tách toàn bộ mã nguồn thành các module Page &amp; Context chuyên biệt.</li>
                <li>Tích hợp PWA chuẩn hóa, offline cache, Web App Manifest &amp; in-app install button.</li>
                <li>Màn hình Kitchen Display System (KDS) và màn hình khách theo dõi món trực tiếp.</li>
                <li>Sơ đồ kéo thả bàn, gộp bàn (merge), tách bàn (split) và chuyển bàn (move table).</li>
                <li>Bộ giải thuật AI Suite: Dự báo lượng khách, gợi ý nhân sự, phát hiện đặt bàn ảo, phân tích sentiment đánh giá.</li>
                <li>Chia tiền hóa đơn (Split Bill) kèm tạo mã VietQR theo từng phần người ăn.</li>
                <li>Hóa đơn điện tử VAT chuẩn hóa có chức năng in PDF và gửi email.</li>
                <li>Quản lý kho nguyên liệu, tự động trừ kho theo công thức món và cảnh báo sắp hết hàng.</li>
                <li>Chấm công, phân ca làm việc, tính lương cơ bản &amp; đánh giá KPI nhân sự.</li>
                <li>Thanh lệnh toàn cục Command Palette (Ctrl+K) và phím tắt quản trị.</li>
              </ul>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsChangelogOpen(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold hover:bg-amber-400"
              >
                Đã Rõ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
