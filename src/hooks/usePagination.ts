import { useState, useMemo } from 'react';

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedItems: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canNext: boolean;
  canPrev: boolean;
  totalItems: number;
}

export function usePagination<T>(items: T[], pageSize: number = 8): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    pageSize,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    canNext: currentPage < totalPages,
    canPrev: currentPage > 1,
    totalItems: items.length,
  };
}
