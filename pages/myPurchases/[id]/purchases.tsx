import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Tooltip,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
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
  Center,
} from '@chakra-ui/react';
import { ChatIcon, RepeatIcon, ViewIcon, WarningIcon } from '@chakra-ui/icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { BUCKET_FILES_URL, IMPREDEA_EMAIL, MY_PURCHASES_SECTIONS } from '@/utils/constants';
import { Layout } from '@/components/myPurchases';
import { LoadingPage, ErrorPage, PaginationButtons, ReportProblemModal, EmptyResults } from '@/components/common';
import { GET_SALES_BY_CLIENT_ID, GET_SALE_BY_PK } from '@/graphql/queries';
import { usePagination } from '@/hooks/index';
import { Quotation } from 'types';
import { useForm } from 'react-hook-form';
import { REPORT_PROBLEM } from '@/graphql/mutations';
import { SessionContext } from '@/context/sessionContext';
import { sendEmail } from '@/utils/miscellaneous';

interface FormValues {
  subject: string;
  description: string;
}

interface Props {}
interface Sale {
  quotation: Quotation;
  id: string;
}

const Purchases = ({}: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const [currentPurchaseId, setCurrentPurchaseId] = useState();
  const toast = useToast();
  const context = useContext(SessionContext);
  const currentUser = context.getUser();
  const [selectedSale, setSelectedSale] = useState<string>();
  const { data, loading, error, refetch } = useQuery(GET_SALES_BY_CLIENT_ID, { variables: { id } });
  const [getPurchase, { loading: loadingGetPurchase, data: currentPurchase }] = useLazyQuery(GET_SALE_BY_PK, {
    variables: { id: currentPurchaseId },
  });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);
  const { isOpen: reportProblemIsOpen, onOpen: reportProblemOnOpen, onClose: reportProblemOnClose } = useDisclosure();
  const { isOpen: purchaseIsOpen, onOpen: purchaseOnOpen, onClose: purchaseOnClose } = useDisclosure();
  const {
    handleSubmit: handleReportProblemSubmit,
    register: registerReportProblem,
    formState: { errors: reportProblemErrors },
    reset: resetReportProblem,
  } = useForm<FormValues>();

  const handleReportProblemClose = () => {
    resetReportProblem();
    reportProblemOnClose();
  };

  const submitReportProblem = async (formData: FormValues) => {
    if (currentUser) {
      reportProblem({ variables: { ...formData, reporter: currentUser.id, related_sale: selectedSale } });
      const emailBody = {
        to: IMPREDEA_EMAIL,
        from: currentUser.email,
        subject: `Problema reportado: ${formData.subject}`,
        message: formData.description,
      };

      sendEmail(emailBody);
    }

    handleReportProblemClose();
  };

  const [reportProblem] = useMutation(REPORT_PROBLEM, {
    onCompleted: () => {
      toast({
        title: 'Se ha reportado tu problema.',
        description: 'En breve te contactaremos para solucionarlo',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Ha ocurrido un error',
        description: 'Por favor intenta mas tarde',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  const salesHasResults = data ? data.sales.length > 0 : false;

  const handleViewPurchase = (id: any) => {
    setCurrentPurchaseId(id);
    purchaseOnOpen();
  };

  useEffect(() => {
    getPurchase();
  }, [currentPurchaseId, getPurchase]);

  if (loading)
    return (
      <Layout activeTab={MY_PURCHASES_SECTIONS.PURCHASES}>
        <LoadingPage />
      </Layout>
    );

  if (error) return <ErrorPage />;

  return (
    <Layout activeTab={MY_PURCHASES_SECTIONS.PURCHASES}>
      <>
        <ReportProblemModal
          isOpen={reportProblemIsOpen}
          handleOnClose={handleReportProblemClose}
          onSubmit={handleReportProblemSubmit(submitReportProblem)}
          errors={reportProblemErrors}
          register={registerReportProblem}
        />
        {currentPurchase && (
          <Modal isOpen={purchaseIsOpen} onClose={purchaseOnClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Compra de {currentPurchase.sales_by_pk.quotation.product.name}</ModalHeader>
              {loadingGetPurchase ? (
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
                          {currentPurchase.sales_by_pk.quotation.product && (
                            <Image
                              src={`${BUCKET_FILES_URL}products/${currentPurchase.sales_by_pk.quotation.product.id}`}
                              width="400px"
                              height="300px"
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
                          defaultValue={currentPurchase.sales_by_pk.quotation.quantity}
                          readOnly
                        />
                        <FormLabel color="brandBlue" htmlFor="quality">
                          Calidad:
                        </FormLabel>
                        <Input
                          color="black"
                          bg="gray.100"
                          id="quality"
                          defaultValue={currentPurchase.sales_by_pk.quotation.product_quality.label}
                          readOnly
                        />
                        <FormLabel color="brandBlue" htmlFor="material">
                          Material:
                        </FormLabel>
                        <Input
                          color="black"
                          bg="gray.100"
                          id="material"
                          defaultValue={currentPurchase.sales_by_pk.quotation.material.label}
                          readOnly
                        />
                      </Stack>
                      <Stack w="45%">
                        <Text size="md">{`${currentPurchase.sales_by_pk.quotation.product.name} para ${currentPurchase.sales_by_pk.quotation.client.fullname}`}</Text>
                        <FormLabel color="brandBlue" htmlFor="material">
                          Tus indicaciones:
                        </FormLabel>
                        <Textarea
                          color="black"
                          bg="gray.100"
                          id="material"
                          defaultValue={currentPurchase.sales_by_pk.quotation.client_instructions}
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
                          defaultValue={currentPurchase.sales_by_pk.quotation.price}
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
                          defaultValue={currentPurchase.sales_by_pk.quotation.estimated_date}
                        />
                        <FormLabel color="brandBlue" htmlFor="information">
                          Informacion adicional:
                        </FormLabel>
                        <Textarea
                          color="black"
                          bg="gray.100"
                          id="information"
                          readOnly
                          defaultValue={currentPurchase.sales_by_pk.quotation.information}
                        />
                      </Stack>
                    </Flex>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
        {salesHasResults ? (
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
              {data?.sales.map((sale: Sale) => (
                <Tr key={sale.id}>
                  <Td>{sale.quotation.product.name}</Td>
                  <Td>{sale.quotation.estimated_date.slice(0, 10)}</Td>
                  <Td>{sale.quotation.maker.maker_name}</Td>
                  <Td>{sale.quotation.price}</Td>
                  <Td>
                    <Center>
                      <Tooltip hasArrow label="Ver Conversación">
                        <ChatIcon
                          color="facebook"
                          mr="20px"
                          cursor="pointer"
                          onClick={() => {
                            router.push(
                              `/conversation/${sale.quotation.conversation.id}/name/${sale.quotation.maker.maker_name}`
                            );
                          }}
                        />
                      </Tooltip>
                      <Tooltip hasArrow label="Ver Compra">
                        <ViewIcon
                          color="facebook"
                          mr="20px"
                          cursor="pointer"
                          onClick={() => {
                            handleViewPurchase(sale.id);
                          }}
                        />
                      </Tooltip>
                      <Tooltip hasArrow label="Repetir Compra">
                        <RepeatIcon
                          color="facebook"
                          mr="20px"
                          cursor="pointer"
                          onClick={() => {
                            console.log(sale);
                          }}
                        />
                      </Tooltip>
                      <Tooltip hasArrow label="Reportar un problema">
                        <WarningIcon
                          color="red"
                          mr="20px"
                          cursor="pointer"
                          onClick={() => {
                            setSelectedSale(sale.id);
                            reportProblemOnOpen();
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
        <PaginationButtons currentPage={currentPage} hasResults={salesHasResults} setCurrentPage={setCurrentPage} />
      </>
    </Layout>
  );
};

export default Purchases;
