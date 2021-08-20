import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import LoadingPage from '../components/LoadingPage';
import { useGetQuotationsByMakerId } from '../graphql/hooks';
import { EditIcon } from '@chakra-ui/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_QUOTATION_BY_PK } from '../graphql/queries';
import { useForm } from 'react-hook-form';
import { SEND_QUOTATION } from '../graphql/mutations';

const QuotationsAdmin = ({ id }) => {
  const { data, loading, refetch } = useGetQuotationsByMakerId(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const [queryQuotation, { loading: loadingQuotation, data: quotation }] = useLazyQuery(GET_QUOTATION_BY_PK);

  const handleOnEdit = (id) => {
    queryQuotation({ variables: { id } });
    onOpen();
  };

  const [updateQuotation] = useMutation(SEND_QUOTATION, {
    onError: () => {
      toast({
        title: 'No se pudo enviar la cotización',
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

  const handleOnClose = () => {
    reset();
    onClose();
    refetch();
  };

  const onSubmit = (formData) => {
    updateQuotation({ variables: { ...formData, id: quotation?.quotations_by_pk.id } });
  };
  if (loading) return <LoadingPage />;

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={handleOnClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enviar Cotización</ModalHeader>
          {loadingQuotation ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalCloseButton />
              <ModalBody>
                <Flex w="100%">
                  <Stack w="40%" mr="5%">
                    <Center>
                      <Box bg="tomato" height="80px" w="300px"></Box>
                    </Center>
                    <FormLabel color="brandBlue" htmlFor="quantity">
                      Cantidad:
                    </FormLabel>
                    <Input
                      color="black"
                      bg="gray.100"
                      id="quantity"
                      type="number"
                      defaultValue={quotation?.quotations_by_pk?.quantity}
                      readOnly
                    />
                    <FormLabel color="brandBlue" htmlFor="quality">
                      Calidad:
                    </FormLabel>
                    <Input
                      color="black"
                      bg="gray.100"
                      id="quality"
                      defaultValue={quotation?.quotations_by_pk.product_quality.label}
                      readOnly
                    />
                    <FormLabel color="brandBlue" htmlFor="material">
                      Material:
                    </FormLabel>
                    <Input
                      color="black"
                      bg="gray.100"
                      id="material"
                      defaultValue={quotation?.quotations_by_pk.material.label}
                      readOnly
                    />
                  </Stack>
                  <Stack w="45%">
                    <Text size="md">{`${quotation?.quotations_by_pk.product.name} para ${quotation?.quotations_by_pk.client.fullname}`}</Text>
                    <FormLabel color="brandBlue" htmlFor="material">
                      Indicaciones del cliente:
                    </FormLabel>
                    <Textarea
                      color="black"
                      bg="gray.100"
                      id="material"
                      defaultValue={quotation?.quotations_by_pk.client_instructions}
                      readOnly
                    />
                    <FormControl isInvalid={errors.price}>
                      <FormLabel color="brandBlue" htmlFor="price">
                        Indica el precio:
                      </FormLabel>
                      <Input
                        bg="white"
                        color="black"
                        id="price"
                        type="number"
                        {...register('price', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.price && errors.price.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.estimated_date}>
                      <FormLabel color="brandBlue" htmlFor="estimated_date">
                        Indica la fecha estimada:
                      </FormLabel>
                      <input
                        style={{
                          color: 'black',
                          border: '1px solid',
                          borderColor: 'inherit',
                          borderRadius: '5px',
                          width: '100%',
                          padding: '6px',
                        }}
                        id="estimated_date"
                        type="date"
                        {...register('estimated_date', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.estimated_date && errors.estimated_date.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.price}>
                      <FormLabel color="brandBlue" htmlFor="information">
                        Informacion adicional:
                      </FormLabel>
                      <Textarea
                        color="black"
                        id="information"
                        placeholder="Hay algo que tu cliente necesite saber? Escribelo aqui."
                        {...register('information', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.information && errors.information.message}</FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" colorScheme="facebook">
                  Enviar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
      <Table variant="striped" colorScheme="gray">
        <TableCaption placement="top">Mis Cotizaciones Pendientes:</TableCaption>
        <Thead>
          <Tr>
            <Th>Producto</Th>
            <Th>Fecha de Pedido</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.quotations.map((quotation) => (
            <Tr key={quotation.id}>
              <Td>{quotation.product.name}</Td>
              <Td>{quotation.updated_at.slice(0, 10)}</Td>
              <Td>{quotation.quotation_status.label.toUpperCase()}</Td>
              <Td>
                <EditIcon
                  color="facebook"
                  mr="20px"
                  cursor="pointer"
                  onClick={() => {
                    handleOnEdit(quotation.id);
                  }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default QuotationsAdmin;
