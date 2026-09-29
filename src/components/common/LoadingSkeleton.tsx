import React from 'react';

export const CardSkeleton: React.FC<{ count?: number; className?: string }> = ({ count = 3, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4 animate-pulse"
        >
          <div className="h-40 bg-stone-200 dark:bg-stone-800 rounded-xl w-full" />
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
          <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-20" />
            <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded-lg w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-12 bg-stone-100 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800" />
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-16" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded flex-1" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-28" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-20" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-12" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-48" />
        <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-32" />
      </div>
      <div className="h-64 bg-stone-100 dark:bg-stone-800/40 rounded-xl flex items-end justify-between p-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-stone-200 dark:bg-stone-800 rounded-t"
            style={{ height: `${20 + (i * 7) % 70}%` }}
          />
        ))}
      </div>
    </div>
  );
};
