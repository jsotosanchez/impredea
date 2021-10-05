import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Flex, Heading, HStack, Spacer, Square, Stack, Text } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useQuery } from '@apollo/client';
import { RenderRating, LoadingPage, Layout } from '../common';
import { MAKER_SECTIONS } from '../../utils/constants';
import { GET_MAKER_BY_ID } from '../../graphql/queries';

interface Props {
  children: JSX.Element;
  activeHeader: String;
}

const MakerProfileLayout = ({ children, activeHeader }: Props): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_MAKER_BY_ID, { variables: { id } });

  if (loading) return <LoadingPage />;

  return (
    <Layout>
      <Flex w="100%" h="100vh" bg="white" p="5%" pt="5%">
        <Stack w="25%">
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
                {data && data.user_by_pk.maker_name}
              </Heading>
              <Spacer />
              {data && <RenderRating rating={data.user_by_pk.maker_rating} />}
            </Flex>
            <Text color="black">{data && data.user_by_pk.maker_description}</Text>
          </>
        </Stack>
        <Box w="70%" pl="20px">
          <HStack spacing="20px" pb="20px">
            <Link href={`/maker/${id}/catalog`} passHref>
              <Heading
                as="h3"
                size="lg"
                color={activeHeader === MAKER_SECTIONS.PRODUCTS ? 'brandBlue' : 'gray.300'}
                cursor="pointer"
              >
                Catalogo
              </Heading>
            </Link>
            <Link href={`/maker/${id}/reviews`} passHref>
              <Heading
                as="h3"
                size="lg"
                color={activeHeader === MAKER_SECTIONS.REVIEWS ? 'brandBlue' : 'gray.300'}
                cursor="pointer"
              >
                Reviews
              </Heading>
            </Link>
            <Link href={`/maker/${id}/questions`} passHref>
              <Heading
                as="h3"
                size="lg"
                color={activeHeader === MAKER_SECTIONS.QUESTIONS ? 'brandBlue' : 'gray.300'}
                cursor="pointer"
              >
                Preguntas
              </Heading>
            </Link>
          </HStack>
          {children}
        </Box>
      </Flex>
    </Layout>
  );
};

export default MakerProfileLayout;
