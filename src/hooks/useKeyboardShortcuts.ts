import { useEffect } from 'react';

type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
};

export function useKeyboardShortcuts(shortcuts: KeyCombo[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in text inputs unless it's ESC or Ctrl combos
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      for (const sc of shortcuts) {
        const matchKey = e.key.toLowerCase() === sc.key.toLowerCase();
        const matchCtrl = sc.ctrlKey ? e.ctrlKey || e.metaKey : true;
        const matchAlt = sc.altKey ? e.altKey : true;
        const matchShift = sc.shiftKey ? e.shiftKey : true;

        if (matchKey && matchCtrl && matchAlt && matchShift) {
          if (!isInput || sc.key === 'Escape' || sc.ctrlKey) {
            e.preventDefault();
            sc.action();
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
