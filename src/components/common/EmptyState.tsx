import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface Props {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<Props> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">{title}</h4>
        <p className="text-xs text-stone-500 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
