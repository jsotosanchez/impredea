import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { useCallback } from 'react';
import {
  GET_SEARCH_PRODUCT_DATA,
  GET_MAKER_BY_ID,
  GET_PRODUCT_BY_ID,
  GET_USER_BY_ID,
  GET_PRODUCTS_BY_MAKER_ID,
  GET_QUESTIONS_BY_MAKER_ID,
  GET_MAKER_INFO_BY_ID,
  GET_USER_IDENTITY_BY_EMAIL,
  GET_QUOTATIONS_BY_MAKER_ID,
  GET_QUOTATIONS_BY_CLIENT_ID,
  GET_SALES_BY_CLIENT_ID,
  GET_SALES_BY_MAKER_ID,
} from './queries';

export const useSearchFormData = () => {
  const { loading, error, data } = useQuery(GET_SEARCH_PRODUCT_DATA);

  if (!loading && data) {
    return {
      loading,
      error,
      data: {
        quantities: data.order_quantity,
        categories: data.maker_category,
      },
    };
  }

  return {
    loading,
    error,
    data,
  };
};

export const useGetMaker = (id) => {
  const { loading, error, data } = useQuery(GET_MAKER_BY_ID, { variables: { id } });

  if (!loading && data) {
    return {
      loading,
      error,
      data: {
        maker: data.user_by_pk,
        products: data.product,
        questions: data.questions,
        reviews: data.reviews,
      },
    };
  }

  return {
    loading,
    error,
    data,
  };
};

export const useGetProduct = (id) => {
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, { variables: { id } });

  if (!loading && data) {
    return {
      loading,
      error,
      data: {
        product: data.product_by_pk,
      },
    };
  }

  return {
    loading,
    error,
    data,
  };
};

export const useGetUser = (id) => {
  const { loading, error, data } = useQuery(GET_USER_BY_ID, { variables: { id } });

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

export const useGetMakerAdmin = (id) => {
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

export const useGetProductsByMakerId = (id) => {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS_BY_MAKER_ID, { variables: { id } });

  if (!loading && data) {
    return {
      loading,
      error,
      data: {
        products: data.product,
      },
      refetch,
    };
  }

  return {
    loading,
    error,
    data,
    refetch,
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

export const useGetQuotationsByMakerId = (id) => {
  const { loading, error, data, refetch } = useQuery(GET_QUOTATIONS_BY_MAKER_ID, { variables: { id } });

  return {
    loading,
    error,
    data,
    refetch,
  };
};
