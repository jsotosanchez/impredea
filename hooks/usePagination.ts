import { useState, useEffect } from 'react';
import { PAGINATION } from '../utils/constants';

export const usePagination = (data, refetch) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    if (data) refetch({ offset: PAGINATION.defaultSize * currentPage });
  }, [data, currentPage]);

  return { currentPage, setCurrentPage };
};
