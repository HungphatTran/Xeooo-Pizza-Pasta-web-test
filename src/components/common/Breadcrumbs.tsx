import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  tabId?: string;
}

interface Props {
  items: BreadcrumbItem[];
  onNavigate: (tabId: string) => void;
}

export const Breadcrumbs: React.FC<Props> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-3">
      <button
        onClick={() => onNavigate('booking')}
        className="flex items-center gap-1 hover:text-stone-900 dark:hover:text-stone-100 transition"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Trang Chủ</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            {isLast || !item.tabId ? (
              <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(item.tabId!)}
                className="hover:text-stone-900 dark:hover:text-stone-100 transition truncate"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
