import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { useCallback } from 'react';
import { GET_MAKER_INFO_BY_ID, GET_USER_IDENTITY_BY_EMAIL, GET_QUOTATIONS_BY_MAKER_ID } from './queries';

export const useGetMakerAdmin = (id: number) => {
  const { loading, error, data } = useQuery(GET_MAKER_INFO_BY_ID, { variables: { id } });

  if (!loading && data) {
    return {
      loading,
      error,
      data: {
        user: data.user_by_pk,
      },
    };
  }

  return {
    loading,
    error,
    data,
  };
};

const emptyData = {};

export const useGetUserIdentity = () => {
  const [lazyQuery, { loading, error, data }] = useLazyQuery(GET_USER_IDENTITY_BY_EMAIL);

  const getIdentity = useCallback((user) => lazyQuery({ variables: { email: user.email } }), [lazyQuery]);

  if (!loading && data) {
    return {
      getIdentity,
      loading,
      error,
      data: data.user[0],
    };
  }

  return {
    getIdentity,
    loading,
    error,
    data: emptyData,
  };
};

export const useGetQuotationsByMakerId = (id: number) => {
  const { loading, error, data, refetch } = useQuery(GET_QUOTATIONS_BY_MAKER_ID, { variables: { id } });

  return {
    loading,
    error,
    data,
    refetch,
  };
};
