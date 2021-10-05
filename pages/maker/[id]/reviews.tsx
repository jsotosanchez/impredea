import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { UnorderedList } from '@chakra-ui/react';
import { LoadingPage } from '@/components/common';
import { ReviewCard, Layout } from '@/components/makerPage';
import { GET_MAKER_REVIEWS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { MAKER_SECTIONS } from '@/utils/constants';

interface Review {
  id: string;
  client: Client;
  rating: number;
  text: string;
}

interface Client {
  fullname: string;
}
export default function Reviews(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, refetch } = useQuery(GET_MAKER_REVIEWS, { variables: { id } });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading)
    return (
      <Layout activeHeader={MAKER_SECTIONS.REVIEWS}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MAKER_SECTIONS.REVIEWS}>
      <UnorderedList>
        {data.reviews.map((review: Review) => (
          <ReviewCard key={review.id} client={review.client} rating={review.rating} text={review.text} />
        ))}
      </UnorderedList>
    </Layout>
  );
}
