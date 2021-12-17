import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';
import { GET_MAKER_CATALOG } from '@/graphql/queries';
import { Layout } from '@/components/makerPage';
import { Authorization, EmptyResults, LoadingPage, PaginationButtons } from '@/components/common';
import { BUCKET_FILES_URL, MAKER_SECTIONS } from '@/utils/constants';
import { Product } from 'types';
import { usePagination } from '@/hooks/usePagination';

export default function Catalog(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, refetch } = useQuery(GET_MAKER_CATALOG, { variables: { id } });

  const { currentPage, setCurrentPage } = usePagination(data, refetch);
  useEffect(() => {
    refetch();
  }, [refetch]);

  const catalogHasResults = data ? data.product.length > 0 : false;

  if (loading)
    return (
      <Layout activeHeader={MAKER_SECTIONS.PRODUCTS}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Authorization>
      <Layout activeHeader={MAKER_SECTIONS.PRODUCTS}>
        <>
          {catalogHasResults ? (
            <SimpleGrid columns={3} spacing={7}>
              {data.product.map(({ name, id: pid }: Product) => (
                <Link key={pid} href={`/maker/${id}/product/${pid}`} passHref>
                  <Box cursor="pointer">
                    <Image priority={true} src={`${BUCKET_FILES_URL}products/${pid}`} width="370px" height="240px" alt="" />
                    <Text noOfLines={1} align="center">
                      {name}
                    </Text>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>
          ) : (
            <EmptyResults />
          )}
          <PaginationButtons currentPage={currentPage} hasResults={catalogHasResults} setCurrentPage={setCurrentPage} />
        </>
      </Layout>
    </Authorization>
  );
}
