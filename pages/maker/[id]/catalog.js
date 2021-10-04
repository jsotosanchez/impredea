import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Flex, Heading, HStack, SimpleGrid, Spacer, Spinner, Square, Stack, Text } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useGetMaker } from '../../../graphql/hooks';
import { RenderRating, LoadingPage, Layout } from '../../../components/common';
import { ProductCard } from '../../../components/makerPage';

const CatalogContent = ({ products }) => {
  return (
    <SimpleGrid columns={3} spacing={10}>
      {products.map(({ name, id }) => (
        <ProductCard name={name} id={id} key={id} />
      ))}
    </SimpleGrid>
  );
};

export default function Catalog() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useGetMaker(id);

  if (!data) {
    return <LoadingPage></LoadingPage>;
  }

  return (
    <Layout>
      <Flex w="100%" h="100vh" bg="white" p="5%" pt="5%">
        <Stack w="25%">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Flex
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowLeftIcon color="brandBlue" />
                <Text pl="15px" color="brandBlue" fontWeight="semibold">
                  Volver
                </Text>
              </Flex>
              <Square h="200px" w="200px" bg="whatsapp.300"></Square>
              <Flex>
                <Heading as="h1" color="brandBlue" size="md">
                  {data && data.maker.maker_name}
                </Heading>
                <Spacer />
                {data && <RenderRating rating={data.maker.maker_rating} />}
              </Flex>
              <Text color="black">{data && data.maker.maker_description}</Text>
            </>
          )}
        </Stack>
        <Box w="70%" pl="20px">
          <HStack spacing="20px" pb="20px">
            <Heading as="h3" size="lg" color="brandBlue" cursor="pointer">
              Catalogo
            </Heading>
            <Heading as="h3" size="lg" color="gray.300" cursor="pointer">
              <Link href={`/maker/${id}/reviews`}>
                <a>Reviews</a>
              </Link>
            </Heading>
            <Heading as="h3" size="lg" color="gray.300" cursor="pointer">
              <Link href={`/maker/${id}/questions`}>
                <a>Preguntas</a>
              </Link>
            </Heading>
          </HStack>
          {data && <CatalogContent products={data.products} />}
        </Box>
      </Flex>
    </Layout>
  );
}
