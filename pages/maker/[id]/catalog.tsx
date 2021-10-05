import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';
import { GET_MAKER_CATALOG } from '@/graphql/queries';
import { Layout } from '@/components/makerPage';
import { LoadingPage } from '@/components/common';
import { MAKER_SECTIONS } from '@/utils/constants';
import { Product } from 'types';

export default function Catalog(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, refetch } = useQuery(GET_MAKER_CATALOG, { variables: { id } });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading)
    return (
      <Layout activeHeader={MAKER_SECTIONS.PRODUCTS}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MAKER_SECTIONS.PRODUCTS}>
      <SimpleGrid columns={3} spacing={10}>
        {data.product.map(({ name, id: pid }: Product) => (
          <Link key={pid} href={`/maker/${id}/product/${pid}`} passHref>
            <Box cursor="pointer">
              <Box bg="red.100" height="180px"></Box>
              <Text noOfLines={1} align="center">
                {name}
              </Text>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </Layout>
  );
}
