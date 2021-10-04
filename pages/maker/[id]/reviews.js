import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Flex, Heading, HStack, Spacer, Spinner, Square, Stack, Text, UnorderedList } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useGetMaker } from '../../../graphql/hooks';
import { SessionContext } from '../../../context/sessionContext';
import { RenderRating, LoadingPage, Layout } from '../../../components/common';
import { ReviewCard } from '../../../components/makerPage';

const ReviewsContent = ({ reviews }) => {
  return (
    <UnorderedList>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </UnorderedList>
  );
};

export default function Reviews() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useGetMaker(id);
  const [questionText, setQuestionText] = useState('');
  const context = useContext(SessionContext);
  const { id: currentUserId } = context.getUser();

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
            <Heading as="h3" size="lg" color="gray.300" cursor="pointer">
              <Link href={`/maker/${id}/catalog`}>
                <a>Catalogo</a>
              </Link>
            </Heading>
            <Heading as="h3" size="lg" color="brandBlue" cursor="pointer">
              Reviews
            </Heading>
            <Heading as="h3" size="lg" color="gray.300" cursor="pointer">
              <Link href={`/maker/${id}/questions`}>
                <a>Preguntas</a>
              </Link>
            </Heading>
          </HStack>
          {data && <ReviewsContent reviews={data.reviews} />}
        </Box>
      </Flex>
    </Layout>
  );
}
