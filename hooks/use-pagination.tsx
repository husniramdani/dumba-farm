import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const usePagination = () => {
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialLimit = Number(searchParams.get('limit')) || 10;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1)); // Prevent going below page 1
  };

  const setPageNumber = (newPage: number) => {
    setPage(newPage);
  };

  const setItemsPerPage = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  return {
    page,
    limit,
    nextPage,
    prevPage,
    setPageNumber,
    setItemsPerPage,
  };
};

export default usePagination;