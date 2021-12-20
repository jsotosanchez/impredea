import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import {
  Box, Text, SimpleGrid,
  Center,
  useColorModeValue,
  Heading,
  Stack,
  Image as ChakraImage,
} from '@chakra-ui/react';
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
                  {/* <Box cursor="pointer">
                    <Image priority={true} src={`${BUCKET_FILES_URL}products/${pid}`} width="370px" height="240px" alt="" />
                    <Text noOfLines={1} align="center">
                      {name}
                    </Text>
                  </Box> */}
                  <ProductSimple title={name} pid={pid} />
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

interface CardProps {
  title: string;
  pid: number
}

const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

function ProductSimple({ title, pid }: CardProps) {
  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `${BUCKET_FILES_URL}products/${pid}`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <ChakraImage
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={`${BUCKET_FILES_URL}products/${pid}`}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            {title}
          </Heading>
        </Stack>
      </Box>
    </Center>
  );
}