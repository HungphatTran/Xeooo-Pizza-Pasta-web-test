import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { Sparkles, ArrowRight, Check, X } from 'lucide-react';

export const OnboardingTour: React.FC = () => {
  const { isOnboardingTourActive, stopOnboardingTour, setActiveNavTab } = useUI();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOnboardingTourActive) return null;

  const steps = [
    {
      title: 'Chào mừng đến với Xéooo Pizza & Pasta!',
      description:
        'Hệ thống quản lý nhà hàng thông minh thế hệ mới, tích hợp chọn bàn trực quan theo tầng, khung nhận bàn theo giờ và màn hình bếp KDS thời gian thực.',
      actionTab: 'booking',
    },
    {
      title: 'Khung Nhận Bàn Theo Giờ (Matrix)',
      description:
        'Nhân viên dễ dàng theo dõi tình trạng kín bàn theo từng khung 11h-21h của Tầng 1 sân vườn, Tầng 3 lãng mạn và Tầng 4 bàn to.',
      actionTab: 'schedule',
    },
    {
      title: 'Sơ Đồ Bàn Kéo Thả & Gộp/Tách Bàn',
      description:
        'Trực quan hóa vị trí các bàn ăn, kéo thả sắp xếp lại layout, chuyển bàn hoặc gộp 2 bàn cho khách đoàn đông người chỉ với 1 cú click.',
      actionTab: 'floormap',
    },
    {
      title: 'Màn Hình Bếp Trực Tiếp (Kitchen KDS)',
      description:
        'Bếp trưởng nhận đơn tức thì, bấm trạng thái Đang nấu -> Hoàn thành -> Đã mang ra kèm đếm giờ chế biến chuẩn xác.',
      actionTab: 'kds',
    },
    {
      title: 'Kho Nguyên Liệu & Trí Tuệ Nhân Tạo AI',
      description:
        'Tự động trừ kho theo công thức món, cảnh báo sắp hết nguyên liệu và AI dự báo lượng khách, gợi ý món bán chạy cùng chatbot thông minh.',
      actionTab: 'revenue',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setActiveNavTab(steps[next].actionTab);
    } else {
      stopOnboardingTour();
    }
  };

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Hướng Dẫn Sử Dụng · Bước {currentStep + 1}/{steps.length}</span>
          </div>
          <button
            onClick={stopOnboardingTour}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">{current.title}</h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{current.description}</p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5 pt-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-6 bg-amber-500' : 'w-2 bg-stone-300 dark:bg-stone-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={stopOnboardingTour}
            className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-medium"
          >
            Bỏ qua hướng dẫn
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs hover:bg-amber-400 flex items-center gap-2 shadow-sm transition"
          >
            <span>{currentStep === steps.length - 1 ? 'Bắt Đầu Ngay' : 'Tiếp Tục'}</span>
            {currentStep === steps.length - 1 ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
