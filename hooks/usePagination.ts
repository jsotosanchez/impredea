import { ApolloQueryResult } from '@apollo/client';
import { useState, useEffect } from 'react';
import { PAGINATION } from '@/utils/constants';

export const usePagination = (
  data: any,
  refetch: (variables?: Partial<any>) => Promise<ApolloQueryResult<any>>,
  pageSize: number = PAGINATION.defaultSize
) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    if (data) refetch({ offset: pageSize * currentPage });
  }, [data, currentPage, refetch, pageSize]);

  return { currentPage, setCurrentPage };
};
