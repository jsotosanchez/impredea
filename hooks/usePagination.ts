import { ApolloQueryResult } from '@apollo/client';
import { useState, useEffect } from 'react';
import { PAGINATION } from '../utils/constants';

export const usePagination = (data: any, refetch: (variables?: Partial<any>) => Promise<ApolloQueryResult<any>>) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    if (data) refetch({ offset: PAGINATION.defaultSize * currentPage });
  }, [data, currentPage, refetch]);

  return { currentPage, setCurrentPage };
};
