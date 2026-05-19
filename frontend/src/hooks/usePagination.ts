import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const visibleItems = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, page, itemsPerPage]);

  const currentPage = Math.min(page, totalPages);

  return {
    page: currentPage,
    setPage,
    totalPages,
    visibleItems
  };
}
