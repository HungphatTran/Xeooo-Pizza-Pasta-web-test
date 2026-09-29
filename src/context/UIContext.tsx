import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, translations } from '../utils/i18n';
import { SentEmail } from './RestaurantContext';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface UIContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isAIChatOpen: boolean;
  setAIChatOpen: (open: boolean) => void;
  isOnboardingTourActive: boolean;
  startOnboardingTour: () => void;
  stopOnboardingTour: () => void;
  notifications: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  isOnline: boolean;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('xeooo_lang') as Language) || 'vi';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('xeooo_dark');
      return saved !== null ? JSON.parse(saved) : true; // Default elegant dark for romantic Italian ambiance
    } catch {
      return true;
    }
  });

  const [accentColor, setAccentColor] = useState<string>('amber');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isAIChatOpen, setAIChatOpen] = useState(false);
  const [isOnboardingTourActive, setIsOnboardingTourActive] = useState(false);
  const [notifications, setNotifications] = useState<ToastMessage[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [activeNavTab, setActiveNavTab] = useState<string>('booking');

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('xeooo_dark', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addToast('Đã kết nối trở lại', 'Hệ thống đã đồng bộ trực tuyến thời gian thực.', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      addToast('Mất kết nối mạng', 'Đang hoạt động ở chế độ ngoại tuyến (Offline Cache).', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('xeooo_lang', lang);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newToast, ...prev]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let current: any = translations[language];
      for (const k of keys) {
        if (!current || typeof current !== 'object') return key;
        current = current[k];
      }
      return typeof current === 'string' ? current : key;
    },
    [language]
  );

  const startOnboardingTour = () => setIsOnboardingTourActive(true);
  const stopOnboardingTour = () => setIsOnboardingTourActive(false);

  return (
    <UIContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isDarkMode,
        toggleDarkMode,
        accentColor,
        setAccentColor,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isAIChatOpen,
        setAIChatOpen,
        isOnboardingTourActive,
        startOnboardingTour,
        stopOnboardingTour,
        notifications,
        addToast,
        dismissToast,
        isOnline,
        activeNavTab,
        setActiveNavTab,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
