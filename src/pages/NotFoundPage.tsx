import React from 'react';
import { Home, ArrowLeft, Search, Utensils } from 'lucide-react';

interface Props {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<Props> = ({ onGoHome }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="relative w-28 h-28 mx-auto">
          <div className="w-full h-full rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-serif font-bold text-4xl shadow-inner">
            404
          </div>
          <span className="absolute -bottom-2 -right-2 text-2xl">🍕</span>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Không Tìm Thấy Trang Yêu Cầu
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Đường dẫn bạn truy cập có thể đã được thay đổi vị trí, xóa hoặc không còn tồn tại trên thực đơn Xéooo Pizza & Pasta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Trở Về Trang Chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
