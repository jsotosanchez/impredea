import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  Heading,
  HStack,
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
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Text,
  Tooltip,
  Spacer,
} from '@chakra-ui/react';
import { ChatIcon, RepeatIcon, ViewIcon, WarningIcon } from '@chakra-ui/icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { MY_PURCHASES_SECTIONS } from '../../utils/constants';
import { LoadingPage, Layout, ErrorPage } from '../../components';
import { GET_QUOTATIONS_BY_CLIENT_ID, GET_QUOTATION_BY_PK, GET_SALES_BY_CLIENT_ID } from '../../graphql/queries';
import { ACCEPT_QUOTATION, CREATE_SALE, DECLINE_QUOTATION } from '../../graphql/mutations';
import { usePagination } from '../../hooks';

const Purchases = ({ id }) => {
  const { data, loading, error, refetch } = useQuery(GET_SALES_BY_CLIENT_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Producto</Th>
            <Th>Fecha de Entrega</Th>
            <Th>Maker</Th>
            <Th>Precio</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.sales.map((sale) => (
            <Tr key={sale.id}>
              <Td>{sale.quotation.product.name}</Td>
              <Td>{sale.quotation.estimated_date.slice(0, 10)}</Td>
              <Td>{sale.quotation.maker.maker_name}</Td>
              <Td>{sale.quotation.price}</Td>
              <Td>
                <Center>
                  <Tooltip hasArrow label="Ver Conversación">
                    <ChatIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
                  </Tooltip>
                  <Tooltip hasArrow label="Ver Compra">
                    <ViewIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
                  </Tooltip>
                  <Tooltip hasArrow label="Repetir Compra">
                    <RepeatIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
                  </Tooltip>
                  <Tooltip hasArrow label="Reportar un problema">
                    <WarningIcon color="red" mr="20px" cursor="pointer" onClick={() => {}} />
                  </Tooltip>
                </Center>
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
        {
          <Button variant="solid" colorScheme="facebook" onClick={() => setCurrentPage((prev) => prev + 1)}>
            Siguiente
          </Button>
        }
      </Flex>
    </>
  );
};

const ClientQuotations = ({ id }) => {
  const { data, loading, refetch } = useQuery(GET_QUOTATIONS_BY_CLIENT_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [queryQuotation, { loading: loadingQuotation, data: quotation }] = useLazyQuery(GET_QUOTATION_BY_PK);

  const handleOnEdit = (id) => {
    queryQuotation({ variables: { id } });
    onOpen();
  };

  const [acceptQuotation, { data: acceptQuotationResponse }] = useMutation(ACCEPT_QUOTATION, {
    onError: () => {
      toast({
        title: 'No se pudo aceptar la cotización',
        description: 'Por favor intenta mas tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Se realizo la compra exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleOnClose();
    },
  });

  const [declineQuotation] = useMutation(DECLINE_QUOTATION, {
    onError: () => {
      toast({
        title: 'No se pudo cancelar la cotización',
        description: 'Por favor intenta mas tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Se rechazó la cotización exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleOnClose();
    },
  });

  const [createSale] = useMutation(CREATE_SALE);

  useEffect(() => {
    if (acceptQuotationResponse) {
      const { client_id, maker_id, id } = acceptQuotationResponse.update_quotations_by_pk;
      createSale({ variables: { client_id, maker_id, id } });
    }
  }, [acceptQuotationResponse]);

  const handleComprar = () => {
    const quotationId = quotation.quotations_by_pk.id;
    acceptQuotation({ variables: { id: quotationId } });
  };

  const handleRechazar = () => {
    const quotationId = quotation.quotations_by_pk.id;
    declineQuotation({ variables: { id: quotationId } });
  };

  const handleOnClose = () => {
    onClose();
    refetch();
  };

  if (loading) return <LoadingPage />;

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={handleOnClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cotización</ModalHeader>
          {loadingQuotation ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>
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
                      Tus indicaciones:
                    </FormLabel>
                    <Textarea
                      color="black"
                      bg="gray.100"
                      id="material"
                      defaultValue={quotation?.quotations_by_pk.client_instructions}
                      readOnly
                    />
                    <FormLabel color="brandBlue" htmlFor="price">
                      Precio:
                    </FormLabel>
                    <Input
                      bg="gray.100"
                      color="black"
                      id="price"
                      type="number"
                      readOnly
                      defaultValue={quotation?.quotations_by_pk.price}
                    />
                    <FormLabel color="brandBlue" htmlFor="estimated_date">
                      Fecha Estimada:
                    </FormLabel>
                    <input
                      style={{
                        color: 'black',
                        border: '1px solid',
                        borderColor: 'inherit',
                        borderRadius: '5px',
                        width: '100%',
                        padding: '6px',
                        background: '#EDF2F7',
                      }}
                      id="estimated_date"
                      type="date"
                      readOnly
                      defaultValue={quotation?.quotations_by_pk.estimated_date}
                    />
                    <FormLabel color="brandBlue" htmlFor="information">
                      Informacion adicional:
                    </FormLabel>
                    <Textarea
                      color="black"
                      bg="gray.100"
                      id="information"
                      readOnly
                      defaultValue={quotation?.quotations_by_pk.information}
                    />
                  </Stack>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="facebook" mr={3} onClick={handleComprar}>
                  Comprar
                </Button>
                <Button variant="ghost" colorScheme="red" onClick={handleRechazar}>
                  Rechazar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Producto</Th>
            <Th>Fecha de Pedido</Th>
            <Th>Maker</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.quotations.map((quotation) => (
            <Tr key={quotation.id}>
              <Td>{quotation.product.name}</Td>
              <Td>{quotation.updated_at.slice(0, 10)}</Td>
              <Td>{quotation.maker.maker_name}</Td>
              <Td>{quotation.quotation_status.label.toUpperCase()}</Td>
              <Td>
                <ChatIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
                <ViewIcon
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
      <Flex mt="5px">
        {currentPage > 0 && (
          <Button size="md" variant="outline" colorScheme="facebook" onClick={() => setCurrentPage((prev) => prev - 1)}>
            Anterior
          </Button>
        )}
        <Spacer />
        {
          <Button variant="solid" colorScheme="facebook" onClick={() => setCurrentPage((prev) => prev + 1)}>
            Siguiente
          </Button>
        }
      </Flex>
    </Box>
  );
};

const MyPurchases = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeSection, setActiveSection] = useState(MY_PURCHASES_SECTIONS.QUOTATIONS);

  const renderSection = {
    [MY_PURCHASES_SECTIONS.PURCHASES]: <Purchases id={id} />,
    [MY_PURCHASES_SECTIONS.QUOTATIONS]: <ClientQuotations id={id} />,
  };

  return (
    <Layout>
      <Box w="70%" pl="20px" mt="7%" ml="12%">
        <HStack spacing="20px" pb="20px">
          <Heading
            as="h3"
            size="md"
            color={activeSection === MY_PURCHASES_SECTIONS.QUOTATIONS ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_PURCHASES_SECTIONS.QUOTATIONS)}
          >
            Cotizaciónes
          </Heading>
          <Heading
            as="h3"
            size="md"
            color={activeSection === MY_PURCHASES_SECTIONS.PURCHASES ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_PURCHASES_SECTIONS.PURCHASES)}
          >
            Compras
          </Heading>
        </HStack>
        {renderSection[activeSection]}
      </Box>
    </Layout>
  );
};

export default MyPurchases;
