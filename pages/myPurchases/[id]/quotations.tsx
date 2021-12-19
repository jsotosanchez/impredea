import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Center,
  Flex,
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
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Text,
} from '@chakra-ui/react';
import { ChatIcon, ViewIcon } from '@chakra-ui/icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { BUCKET_FILES_URL, MY_PURCHASES_SECTIONS } from '@/utils/constants';
import { Authorization, EmptyResults, LoadingPage, PaginationButtons } from '@/components/common';
import { Layout } from '@/components/myPurchases';
import { GET_QUOTATIONS_BY_CLIENT_ID, GET_QUOTATION_BY_PK } from '@/graphql/queries';
import { ACCEPT_QUOTATION, CREATE_SALE, DECLINE_QUOTATION } from '@/graphql/mutations';
import { usePagination } from '@/hooks/index';
import { Quotation } from 'types';
import { createMercadoPagoLink } from '@/utils/miscellaneous';
interface Props { }

const Quotations = ({ }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const [mpResponse, setMPResponse] = useState<any>();
  const { data, loading, refetch } = useQuery(GET_QUOTATIONS_BY_CLIENT_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);

  const quotationsHasResults = data ? data.quotations.length > 0 : false;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [queryQuotation, { loading: loadingQuotation, data: quotation }] = useLazyQuery(GET_QUOTATION_BY_PK);

  const handleOnEdit = (id: string) => {
    queryQuotation({ variables: { id } });
    onOpen();
  };

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

  useEffect(() => {
    // status id => 2 === respondido
    if (loading || loadingQuotation || !mpResponse || (quotation && quotation.quotations_by_pk.status_id !== 2)) return;
    const MercadoPago = (window as any).MercadoPago;

    const mp = new MercadoPago('TEST-60ef5b82-f889-4c3a-940d-f76f382391d8', {
      locale: 'es-AR',
    });

    setTimeout(() => {
      mp.checkout({
        preference: {
          id: mpResponse.response.id,
        },
        render: {
          container: '.cho-container',
          label: 'Pagar',
        },
      });
    });
  }, [mpResponse, loading, loadingQuotation, quotation]);

  useEffect(() => {
    if (quotation) {
      createMercadoPagoLink({
        items: [
          {
            title: quotation.quotations_by_pk.product.name,
            unit_price: quotation.quotations_by_pk.price,
            quantity: 1,
            picture_url: `${BUCKET_FILES_URL}products/${quotation.quotations_by_pk.product.id}`,
          },
        ],
        quotationId: quotation.quotations_by_pk.id,
      }).then(setMPResponse);
    }
  }, [quotation]);

  const handleRechazar = () => {
    const quotationId = quotation.quotations_by_pk.id;
    declineQuotation({ variables: { id: quotationId } });
  };

  const handleOnClose = () => {
    onClose();
    refetch();
  };

  const quotationHasBeenResponded =
    quotation && quotation.quotations_by_pk.quotation_status.label.toUpperCase() === 'RESPONDIDO';

  if (loading)
    return (
      <Authorization>
        <Layout activeTab={MY_PURCHASES_SECTIONS.QUOTATIONS}>
          <LoadingPage />
        </Layout>
      </Authorization>
    );

  return (
    <Authorization>
      <Layout activeTab={MY_PURCHASES_SECTIONS.QUOTATIONS}>
        <Box>
          <Modal isOpen={isOpen} onClose={handleOnClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Cotización{quotationHasBeenResponded ? `` : `- Pendiente a respuesta`}</ModalHeader>
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
                          {quotation && (
                            <Image
                              priority={true}
                              src={`${BUCKET_FILES_URL}products/${quotation.quotations_by_pk.product.id}`}
                              width="300px"
                              height="250px"
                              alt=""
                            />
                          )}
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
                        <Text size="md">{`${quotation?.quotations_by_pk.product ? quotation?.quotations_by_pk.product.name : "Producto"} para ${quotation?.quotations_by_pk.client.fullname}`}</Text>
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
                    {quotationHasBeenResponded && (
                      <>
                        {/* <Button colorScheme="facebook" mr={3} onClick={handleComprar}>
                        Comprar
                      </Button> */}
                        <div className="cho-container"></div>
                        <Button variant="ghost" colorScheme="red" onClick={handleRechazar}>
                          Rechazar
                        </Button>
                      </>
                    )}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          {quotationsHasResults ? (
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
                {data.quotations.map((quotation: Quotation) => (
                  <Tr key={quotation.id}>
                    <Td>{quotation.product ? quotation.product.name : ""}</Td>
                    <Td>{quotation.updated_at.slice(0, 10)}</Td>
                    <Td>{quotation.maker.maker_name}</Td>
                    <Td>{quotation.quotation_status.label.toUpperCase()}</Td>
                    <Td>
                      <ChatIcon
                        color="facebook"
                        mr="20px"
                        cursor="pointer"
                        onClick={() => {
                          router.push(`/conversation/${quotation.conversation.id}/name/${quotation.maker.maker_name}`);
                        }}
                      />
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
    </Authorization>
  );
};

export default Quotations;
