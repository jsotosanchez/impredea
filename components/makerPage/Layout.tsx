import { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Flex, Heading, HStack, Spacer, Stack, Text, Button, useToast } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useQuery } from '@apollo/client';
import { RenderRating, LoadingPage, Layout } from '@/components/common';
import { BUCKET_FILES_URL, logInToastId, MAKER_SECTIONS } from '@/utils/constants';
import { SessionContext } from '@/context/sessionContext';
import { GET_MAKER_BY_ID } from '@/graphql/queries';

interface Props {
  children: JSX.Element;
  activeHeader: String;
  onButtonClick?: () => void;
}

const MakerProfileLayout = ({ children, activeHeader, onButtonClick }: Props): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_MAKER_BY_ID, { variables: { id } });
  const toast = useToast();

  const context = useContext(SessionContext);
  const currentUserId = context.getUser()?.id;

  const handleOnButtonClick = () => {
    if (currentUserId) {
      onButtonClick && onButtonClick();
    } else {
      if (!toast.isActive(logInToastId))
        toast({
          id: logInToastId,
          title: 'Tienes que estar registrado para hacer una pregunta',
          status: 'warning',
          isClosable: true,
          position: 'top-right',
        });
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <Layout>
      <Flex w="100%" h="100vh" bg="white" p="5%" pt="5%">
        <Stack w="25%">
          <>
            <Flex
              onClick={() => {
                router.push(`/searchMaker`);
              }}
            >
              <ArrowLeftIcon color="brandBlue" />
              <Text pl="15px" color="brandBlue" fontWeight="semibold">
                Volver
              </Text>
            </Flex>
            <Image
              src={`${BUCKET_FILES_URL}${data.user_by_pk.maker_picture_key}`}
              width="200px"
              height="250px"
              alt=""
            />

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
            <Spacer />
            {activeHeader === MAKER_SECTIONS.QUESTIONS && handleOnButtonClick && (
              <Button colorScheme="facebook" onClick={handleOnButtonClick}>
                Hacer Pregunta
              </Button>
            )}
          </HStack>
          {children}
        </Box>
      </Flex>
    </Layout>
  );
};

export default MakerProfileLayout;
