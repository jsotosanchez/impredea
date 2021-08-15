import { useQuery } from '@apollo/react-hooks';
import {
  GET_SEARCHFORM_QUERY,
  GET_MAKER_BY_ID,
  GET_PRODUCT_BY_ID,
  GET_USER_BY_ID,
  GET_PRODUCTS_BY_MAKER_ID,
  GET_QUESTIONS_BY_MAKER_ID,
  GET_MAKER_INFO_BY_ID,
} from './queries';

export const useSearchFormData = () => {
  const { loading, error, data } = useQuery(GET_SEARCHFORM_QUERY);

  if (!loading && data.deals) {
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
        maker: data.maker_by_pk,
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
        maker: data.maker_by_pk,
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
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_MAKER_ID, { variables: { id } });

  if (!loading && data) {
    return {
      loading,
      error,
      data: {
        products: data.product,
      },
    };
  }

  return {
    loading,
    error,
    data,
  };
};

export const useGetQuestionsByMakerId = (id) => {
  const { loading, error, data } = useQuery(GET_QUESTIONS_BY_MAKER_ID, { variables: { id } });

  if (!loading && data) {
    return {
      loading,
      error,
      data,
    };
  }

  return {
    loading,
    error,
    data,
  };
};
