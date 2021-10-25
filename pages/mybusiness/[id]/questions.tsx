import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Center,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_QUESTIONS_BY_MAKER_ID, GET_QUESTION_BY_ID } from '@/graphql/queries';
import { UPDATE_QUESTION_BY_ID } from '@/graphql/mutations';
import { usePagination } from '@/hooks/index';
import { ErrorPage, LoadingPage, PaginationButtons, EmptyResults } from '@/components/common';
import { Layout } from '@/components/mybusiness';
import { MY_BUSINESS_SECTIONS } from '@/utils/constants';

interface FormValues {
  response: string;
}

interface Client {
  fullname: string;
}

interface Question {
  id: number;
  client: Client;
  created_at: string;
}

const Questions = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, refetch, error } = useQuery(GET_QUESTIONS_BY_MAKER_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const questionsHasResults = data ? data.questions.length > 0 : false;
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [currentQuestionId, setCurrentQuestionId] = useState<number>();
  const [getQuestion, { loading: loadingQuestion, data: question }] = useLazyQuery(GET_QUESTION_BY_ID, {
    variables: { id: currentQuestionId },
  });

  const handleOnClose = () => {
    reset();
    onClose();
    refetch();
  };

  const [updateQuestion] = useMutation(UPDATE_QUESTION_BY_ID, {
    onError: () => {
      toast({
        title: 'No se pudo responder la pregunta',
        description: 'Por favor intenta mas tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Se respondio la pregunta exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleOnClose();
    },
  });

  useEffect(() => {
    getQuestion();
  }, [currentQuestionId, getQuestion]);

  const handleViewQuestion = (id: number) => {
    setCurrentQuestionId(id);
    onOpen();
  };

  const onSubmit = (formData: FormValues) => {
    const now = new Date().toISOString();
    updateQuestion({
      variables: { id: currentQuestionId, ...formData, answered_at: now },
    });
  };

  if (error) return <ErrorPage route={`/`} />;

  if (loading)
    return (
      <Layout activeHeader={MY_BUSINESS_SECTIONS.QUESTIONS}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MY_BUSINESS_SECTIONS.QUESTIONS}>
      <Box>
        <Modal isOpen={isOpen} onClose={handleOnClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {loadingQuestion ? '' : `${question?.questions_by_pk?.client?.fullname} pregunta:`}
            </ModalHeader>
            {loadingQuestion ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalCloseButton />
                <ModalBody>
                  <Text>{question?.questions_by_pk.question}</Text>
                  <FormControl isInvalid={errors.response != undefined}>
                    <FormLabel color="brandBlue" htmlFor="response">
                      Responde a la pregunta aqui:
                    </FormLabel>
                    <Textarea
                      id="response"
                      placeholder="Recuerda! cada pregunta es de un posible cliente, se lo mas detallado posible"
                      {...register('response', {
                        required: 'Este campo es requerido',
                      })}
                    />
                    <FormErrorMessage>{errors.response && errors.response.message}</FormErrorMessage>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" colorScheme="facebook">
                    Responder
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
        {questionsHasResults ? (
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Cliente</Th>
                <Th>Realizada el:</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.questions.map((question: Question) => (
                <Tr key={question.id}>
                  <Td>{question.client.fullname}</Td>
                  <Td>{question.created_at}</Td>
                  <Td>
                    <Tooltip hasArrow label="Responder">
                      <ViewIcon
                        color="facebook"
                        mr="20px"
                        cursor="pointer"
                        onClick={() => handleViewQuestion(question.id)}
                      />
                    </Tooltip>
                    {/* <CloseIcon color="red" cursor="pointer" onClick={() => handleOnDelete(question.id)} /> */}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <EmptyResults />
        )}
        <PaginationButtons currentPage={currentPage} hasResults={questionsHasResults} setCurrentPage={setCurrentPage} />
      </Box>
    </Layout>
  );
};
export default Questions;
