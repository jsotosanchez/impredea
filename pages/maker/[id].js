import { useContext, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
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
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { useGetMaker } from '../../graphql/hooks';
import { RenderRating } from '../../components/RenderRating';
import { MAKER_SECTIONS } from '../../utils/constants';
import QuestionCard from '../../components/QuestionCard';
import ReviewCard from '../../components/ReviewCard';
import { useMutation } from '@apollo/client';
import { MAKE_QUESTION_TO_MAKER } from '../../graphql/mutations';
import MakeQuestionModal from '../../components/MakeQuestionModal';
import ProductCard from '../../components/ProductCard';
import LoadingPage from '../../components/LoadingPage';
import { SessionContext } from '../../context/sessionContext';

const Catalog = ({ products }) => {
  return (
    <SimpleGrid columns={3} spacing={10}>
      {products.map(({ name, id }) => (
        <ProductCard name={name} id={id} key={id} />
      ))}
    </SimpleGrid>
  );
};

const Questions = ({ questions }) => {
  return (
    <UnorderedList>
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </UnorderedList>
  );
};

const Reviews = ({ reviews }) => {
  return (
    <UnorderedList>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </UnorderedList>
  );
};

export default function MakerProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useGetMaker(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeSection, setActiveSection] = useState(MAKER_SECTIONS.PRODUCTS);
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
  const renderSection = {
    [MAKER_SECTIONS.PRODUCTS]: <Catalog products={data.products} />,
    [MAKER_SECTIONS.QUESTIONS]: <Questions questions={data.questions} />,
    [MAKER_SECTIONS.REVIEWS]: <Reviews reviews={data.reviews} />,
  };

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
            <Heading
              as="h3"
              size="lg"
              color={activeSection === MAKER_SECTIONS.PRODUCTS ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
              onClick={() => setActiveSection(MAKER_SECTIONS.PRODUCTS)}
            >
              Catalogo
            </Heading>
            <Heading
              as="h3"
              size="lg"
              color={activeSection === MAKER_SECTIONS.REVIEWS ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
              onClick={() => setActiveSection(MAKER_SECTIONS.REVIEWS)}
            >
              Reviews
            </Heading>
            <Heading
              as="h3"
              size="lg"
              color={activeSection === MAKER_SECTIONS.QUESTIONS ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
              onClick={() => setActiveSection(MAKER_SECTIONS.QUESTIONS)}
            >
              Preguntas
            </Heading>
            <Spacer />
            {activeSection === MAKER_SECTIONS.QUESTIONS && (
              <Button colorScheme="facebook" onClick={onOpen}>
                Hacer pregunta
              </Button>
            )}
          </HStack>
          {data && renderSection[activeSection]}
        </Box>
      </Flex>
    </Layout>
  );
}
