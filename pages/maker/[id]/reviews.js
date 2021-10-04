import { useRouter } from 'next/router';
import { UnorderedList } from '@chakra-ui/react';
import { LoadingPage } from '../../../components/common';
import { ReviewCard, Layout } from '../../../components/makerPage';
import { GET_MAKER_REVIEWS } from '../../../graphql/queries';
import { useQuery } from '@apollo/client';
import { MAKER_SECTIONS } from '../../../utils/constants';

export default function Reviews() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_MAKER_REVIEWS, { variables: { id } });

  if (loading)
    return (
      <Layout activeHeader={MAKER_SECTIONS.REVIEWS}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MAKER_SECTIONS.REVIEWS}>
      <UnorderedList>
        {data.reviews.map((review) => (
          <ReviewCard key={review.id} client={review.client} rating={review.rating} text={review.text} />
        ))}
      </UnorderedList>
    </Layout>
  );
}
