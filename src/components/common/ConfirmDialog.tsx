import React from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { AlertCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<Props> = ({
  isOpen,
  title,
  message,
  confirmText = 'Xác Nhận',
  cancelText = 'Hủy Bỏ',
  isDangerous = false,
  onConfirm,
  onCancel,
}) => {
  const containerRef = useFocusTrap(isOpen);

  useKeyboardShortcuts([
    { key: 'Escape', action: onCancel },
  ]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in"
    >
      <div
        ref={containerRef}
        className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDangerous
                  ? 'bg-rose-500/10 text-rose-500'
                  : 'bg-amber-500/10 text-amber-500'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 id="confirm-dialog-title" className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            aria-label="Đóng cửa sổ"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{message}</p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl font-semibold text-xs transition ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xs'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
