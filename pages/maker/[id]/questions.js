import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spacer,
  Spinner,
  Square,
  Stack,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useGetMaker } from '../../../graphql/hooks';
import { RenderRating, LoadingPage, Layout } from '../../../components/common';
import { MakeQuestionModal } from '../../../components/makerPage';
import { useMutation } from '@apollo/client';
import { MAKE_QUESTION_TO_MAKER } from '../../../graphql/mutations';
import { SessionContext } from '../../../context/sessionContext';
import { QuestionCard } from '../../../components/makerPage';

const QuestionsContent = ({ questions }) => {
  return (
    <UnorderedList>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question.question}
          client={question.client}
          response={question.response}
        />
      ))}
    </UnorderedList>
  );
};

export default function Questions() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useGetMaker(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [questionText, setQuestionText] = useState('');
  const toast = useToast();
  const context = useContext(SessionContext);
  const { id: currentUserId } = context.getUser();

  const [createQuestion] = useMutation(MAKE_QUESTION_TO_MAKER, {
    onError: () => {
      toast({
        title: 'No se pudo hacer la pregunta',
        description: 'Por favor intenta mas tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Se realizo tu pregunta con exito',
        description: 'Seras notificado cuando el Maker te responda.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  if (!data) {
    return <LoadingPage></LoadingPage>;
  }

  const handleSubmit = () => {
    const newQuestion = {
      maker_id: id,
      user_id: currentUserId,
      question: questionText,
    };

    createQuestion({
      variables: { ...newQuestion },
    });
    // add react-hook-form and reset
    setQuestionText('');
    onClose();
  };

  return (
    <Layout>
      <MakeQuestionModal
        isOpen={isOpen}
        onClose={onClose}
        questionText={questionText}
        setQuestionText={setQuestionText}
        onSubmit={handleSubmit}
      />
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
            <Heading as="h3" size="lg" color="gray.300" cursor="pointer">
              <Link href={`/maker/${id}/reviews`}>
                <a>Reviews</a>
              </Link>
            </Heading>
            <Heading as="h3" size="lg" color="brandBlue" cursor="pointer">
              Preguntas
            </Heading>
            <Spacer />
            <Button colorScheme="facebook" onClick={onOpen}>
              Hacer pregunta
            </Button>
          </HStack>
          {data && <QuestionsContent questions={data.questions} />}
        </Box>
      </Flex>
    </Layout>
  );
}
