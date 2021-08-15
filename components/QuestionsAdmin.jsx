import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  useDisclosure,
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
  useToast,
} from '@chakra-ui/react';
import LoadingPage from './LoadingPage';
import { useGetQuestionsByMakerId } from '../graphql/hooks';
import { CloseIcon, ViewIcon } from '@chakra-ui/icons';
import { GET_QUESTION_BY_ID } from '../graphql/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { UPDATE_QUESTION_BY_ID } from '../graphql/mutations';
const QuestionsAdmin = ({ id }) => {
  const { data, loading } = useGetQuestionsByMakerId(id);
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

  const [updateQuestion] = useMutation(UPDATE_QUESTION_BY_ID, {
    onError: () => {
      toast({
        title: 'No se responder la pregunta',
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
    },
  });

  useEffect(() => {
    getQuestion();
  }, [currentQuestionId]);

  const handleViewQuestion = (id) => {
    setCurrentQuestionId(id);
    onOpen();
  };

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (formData) => {
    const now = new Date();
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
          <ModalHeader>{loadingQuestion ? '' : `${question?.questions_by_pk?.user?.fullname} pregunta:`}</ModalHeader>
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
        <TableCaption placement="top">Preguntas pendientes:</TableCaption>
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
              <Td>{question.user.fullname}</Td>
              <Td>{question.created_at}</Td>
              <Td>
                <ViewIcon color="facebook" mr="20px" cursor="pointer" onClick={() => handleViewQuestion(question.id)} />
                <CloseIcon color="red" cursor="pointer" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
export default QuestionsAdmin;
