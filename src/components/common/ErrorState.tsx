import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<Props> = ({
  title = 'Không thể tải dữ liệu',
  message = 'Đã có lỗi xảy ra trong quá trình kết nối với máy chủ. Vui lòng thử lại.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 rounded-3xl space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="font-serif font-bold text-base text-rose-600 dark:text-rose-400">{title}</h4>
        <p className="text-xs text-stone-500 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-semibold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Thử Lại</span>
        </button>
      )}
    </div>
  );
};
