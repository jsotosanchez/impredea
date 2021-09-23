import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spacer,
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
import { useForm } from 'react-hook-form';
import { ViewIcon } from '@chakra-ui/icons';
import { GET_QUESTIONS_BY_MAKER_ID, GET_QUESTION_BY_ID } from '../graphql/queries';
import { UPDATE_QUESTION_BY_ID } from '../graphql/mutations';
import { LoadingPage } from '.';
import { usePagination } from '../hooks/';

const QuestionsAdmin = ({ id }) => {
  const { data, loading, refetch } = useQuery(GET_QUESTIONS_BY_MAKER_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const [currentQuestionId, setCurrentQuestionId] = useState();
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
  }, [currentQuestionId]);

  const handleViewQuestion = (id) => {
    setCurrentQuestionId(id);
    onOpen();
  };

  const onSubmit = (formData) => {
    const now = new Date().toISOString();
    updateQuestion({
      variables: { id: currentQuestionId, ...formData, answered_at: now },
    });
  };

  if (loading) return <LoadingPage />;

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{loadingQuestion ? '' : `${question?.questions_by_pk?.client?.fullname} pregunta:`}</ModalHeader>
          {loadingQuestion ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalCloseButton />
              <ModalBody>
                <Text>{question?.questions_by_pk.question}</Text>
                <FormControl isInvalid={errors.response}>
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
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Cliente</Th>
            <Th>Realizada el:</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.questions.map((question) => (
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
      <Flex mt="5px">
        {currentPage > 0 && (
          <Button size="md" variant="outline" colorScheme="facebook" onClick={() => setCurrentPage((prev) => prev - 1)}>
            Anterior
          </Button>
        )}
        <Spacer />
        <Button variant="solid" colorScheme="facebook" onClick={() => setCurrentPage((prev) => prev + 1)}>
          Siguiente
        </Button>
      </Flex>
    </Box>
  );
};
export default QuestionsAdmin;
