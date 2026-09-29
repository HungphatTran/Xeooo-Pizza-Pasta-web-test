import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition"
          title="Cài đặt Xéooo Pizza thành ứng dụng điện thoại hoặc máy tính"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cài Ứng Dụng</span>
        </button>
      )}

      {isIOS && !isInstallable && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-amber-500 border border-amber-500/30 hover:bg-amber-500/10 rounded-lg transition"
          title="Cài đặt trên iPhone/iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Cài iOS</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white">
                Cài Đặt Trên iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              1. Nhấn nút <strong>Chia sẻ (Share)</strong> ở thanh công cụ trình duyệt Safari (biểu tượng mũi tên hướng lên).<br />
              2. Kéo xuống và chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>.<br />
              3. Mở ứng dụng trực tiếp từ màn hình chính để tận hưởng trải nghiệm mượt mà không thanh địa chỉ.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-semibold text-stone-950 hover:bg-amber-400 transition"
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
