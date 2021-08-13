import { useQuery } from '@apollo/react-hooks';
import { GET_SEARCHFORM_QUERY, GET_MAKER_BY_ID } from './queries';

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
