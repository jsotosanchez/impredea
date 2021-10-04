import { useRouter } from 'next/router';
import { SimpleGrid } from '@chakra-ui/react';
import { ProductCard, Layout } from '../../../components/makerPage';
import { useQuery } from '@apollo/client';
import { GET_MAKER_CATALOG } from '../../../graphql/queries';
import { LoadingPage } from '../../../components/common';
import { MAKER_SECTIONS } from '../../../utils/constants';

export default function Catalog() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_MAKER_CATALOG, { variables: { id } });

  if (loading)
    return (
      <Layout activeHeader={MAKER_SECTIONS.PRODUCTS}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MAKER_SECTIONS.PRODUCTS}>
      <SimpleGrid columns={3} spacing={10}>
        {data.product.map(({ name, id }) => (
          <ProductCard name={name} id={id} key={id} />
        ))}
      </SimpleGrid>
    </Layout>
  );
}
