import { useState, useEffect } from 'react';
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
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Checkbox,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { EditIcon, ChatIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import client from '@/graphql/apollo-client';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_QUOTATIONS_BY_MAKER_ID, GET_QUOTATION_BY_PK, GET_QUOTATIONS_STATUSES } from '@/graphql/queries';
import { SEND_QUOTATION } from '@/graphql/mutations';
import { usePagination } from '@/hooks/index';
import { ErrorPage, LoadingPage, PaginationButtons, EmptyResults } from '@/components/common';
import { Layout } from '@/components/mybusiness';
import { MY_BUSINESS_SECTIONS } from '@/utils/constants';
import { useRouter } from 'next/router';

const Quotations = ({ statuses }) => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data,
    loading,
    refetch: refetchQuotations,
    error,
  } = useQuery(GET_QUOTATIONS_BY_MAKER_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetchQuotations);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [checkedStatuses, setCheckedStatuses] = useState([true, true, true, false]);
  const allChecked = checkedStatuses.every(Boolean);
  const isIndeterminate = checkedStatuses.some(Boolean) && !allChecked;

  const quotationsHasResults = data ? data.quotations.length > 0 : false;
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
    refetchQuotations();
  };

  const onSubmit = (formData) => {
    updateQuotation({ variables: { ...formData, id: quotation?.quotations_by_pk.id } });
  };

  useEffect(() => {
    const statuses = checkedStatuses.map((status, id) => {
      if (status) return id + 1;
      return 0;
    });
    refetchQuotations({ id, statuses });
    setCurrentPage(0);
  }, [checkedStatuses, refetchQuotations, setCurrentPage, id]);

  if (error) return <ErrorPage route={`/`} />;

  if (loading)
    return (
      <Layout activeHeader={MY_BUSINESS_SECTIONS.QUOTATIONS}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MY_BUSINESS_SECTIONS.QUOTATIONS}>
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
        <>
          <HStack pl={6} mt={1} spacing={1}>
            <Checkbox
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={(e) => setCheckedStatuses(statuses.map(() => e.target.checked))}
            >
              Todos
            </Checkbox>
            {statuses.map(({ id, label }, index) => (
              <Checkbox
                isChecked={checkedStatuses[index]}
                onChange={(e) => {
                  setCheckedStatuses((prev) => {
                    const newValues = [...prev];
                    newValues[index] = e.target.checked;
                    return newValues;
                  });
                }}
                key={id}
              >
                {label}
              </Checkbox>
            ))}
          </HStack>
        </>
        {quotationsHasResults ? (
          <Table variant="striped" colorScheme="gray">
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
                    <Center>
                      {quotation.status_id === 1 && (
                        <Tooltip hasArrow label="Responder">
                          <EditIcon
                            color="facebook"
                            mr="20px"
                            cursor="pointer"
                            onClick={() => {
                              handleOnEdit(quotation.id);
                            }}
                          />
                        </Tooltip>
                      )}
                      <Tooltip hasArrow label="Ver conversacion">
                        <ChatIcon
                          color="facebook"
                          mr="20px"
                          cursor="pointer"
                          onClick={() => {
                            router.push(`/conversation/${quotation.conversation.id}/name/${quotation.client.fullname}`);
                          }}
                        />
                      </Tooltip>
                    </Center>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <EmptyResults />
        )}
        <PaginationButtons
          currentPage={currentPage}
          hasResults={quotationsHasResults}
          setCurrentPage={setCurrentPage}
        />
      </Box>
    </Layout>
  );
};

export default Quotations;

export async function getServerSideProps() {
  const { data } = await client.query({
    query: GET_QUOTATIONS_STATUSES,
  });

  return {
    props: {
      statuses: data.quotation_statuses,
    },
  };
}
