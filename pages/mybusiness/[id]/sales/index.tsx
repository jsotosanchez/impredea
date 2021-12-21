import { useRouter } from 'next/router';
import { Center, Table, Tbody, Td, Th, Thead, Tooltip, Tr, useDisclosure, useToast, Flex, Input, FormLabel, Box, Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalContent, Spinner, VStack, Text, Spacer } from '@chakra-ui/react';
import { ChatIcon, ViewIcon, WarningIcon } from '@chakra-ui/icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { GET_CLIENT_INFO, GET_SALES_BY_MAKER_ID } from '@/graphql/queries';
import { ErrorPage, ReportProblemModal, LoadingPage, PaginationButtons, EmptyResults, Authorization } from '@/components/common';
import { usePagination } from '@/hooks/index';
import { REPORT_PROBLEM } from '@/graphql/mutations';
import { SessionContext } from '@/context/sessionContext';
import { Layout, ClientModal } from '@/components/myBusiness';
import { MY_BUSINESS_SECTIONS } from '@/utils/constants';
import { IMPREDEA_EMAIL } from '@/utils/constants';
import { sendEmail } from '@/utils/miscellaneous';
import _ from 'lodash';
import { formatToStartsWith } from '@/graphql/utils';

interface ProblemFormValues {
  subject: string;
  description: string;
}

interface Quotation {
  product: { name: string };
  estimated_date: string;
  price: number;
  conversation: { id: string };
}

interface Sale {
  id: number;
  quotation: Quotation;
  client: { fullname: string, id: number };
}

const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0];

const SalesAdmin = ({ }) => {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const context = useContext(SessionContext);
  const currentUser = context.getUser()?.id;
  const [selectedSale, setSelectedSale] = useState<number>();
  const [productNameFilter, setProductNameFilter] = useState("");
  const [clientNameFilter, setClientNameFilter] = useState("");
  const [startFilterDate, setStartFilterDate] = useState(today);
  const [endFilterDate, setEndFilterDate] = useState(nextMonth);
  const { data, loading, refetch, error } = useQuery(GET_SALES_BY_MAKER_ID, { variables: { id, productFilter: formatToStartsWith(productNameFilter), clientFilter: formatToStartsWith(clientNameFilter), startDate: startFilterDate, endDate: endFilterDate } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);

  const [clientId, setClientId] = useState<number | undefined>();
  const [getClient, { loading: loadingClient, data: currentClient }] = useLazyQuery(GET_CLIENT_INFO, {
    variables: { clientId },
  });
  const {
    handleSubmit: handleReportProblemSubmit,
    register: registerReportProblem,
    formState: { errors: reportProblemErrors },
    reset: resetReportProblem,
  } = useForm<ProblemFormValues>();

  const salesHasResults = data ? data.sales.length > 0 : false;
  const { isOpen: reportProblemIsOpen, onOpen: reportProblemOnOpen, onClose: reportProblemOnClose } = useDisclosure();
  const { isOpen: clientIsOpen, onOpen: clientOnOpen, onClose: clientOnClose } = useDisclosure();

  const handleReportProblemClose = () => {
    resetReportProblem();
    reportProblemOnClose();
  };

  const submitReportProblem = (formData: ProblemFormValues) => {
    reportProblem({ variables: { ...formData, reporter: currentUser, related_sale: selectedSale } });
    const emailBody = {
      to: 'jm.soto.sanchez@gmail.com',
      from: IMPREDEA_EMAIL,
      subject: `Problema reportado: ${formData.subject}`,
      message: formData.description,
    };

    sendEmail(emailBody);
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

  const handleOpenClientModal = (id: number) => {
    setClientId(id)
    clientOnOpen()
  }

  useEffect(() => {
    getClient()
  }, [clientId])

  if (error) return <ErrorPage route={`/`} />;

  return (
    <Authorization>
      <Layout activeHeader={MY_BUSINESS_SECTIONS.SALES}>
        <>
          <ReportProblemModal
            isOpen={reportProblemIsOpen}
            handleOnClose={handleReportProblemClose}
            onSubmit={handleReportProblemSubmit(submitReportProblem)}
            errors={reportProblemErrors}
            register={registerReportProblem}
          />
          {currentClient && <ClientModal isOpen={clientIsOpen} loading={loadingClient} handleOnClose={clientOnClose} client={currentClient} />}
          <Flex mt="15px" mb="15px">
            <FormLabel color="brandBlue" pt="5px">
              Producto
            </FormLabel>
            <Input
              w="15%"
              value={productNameFilter}
              onChange={(e) => setProductNameFilter(e.target.value)}
            />
            <FormLabel color="brandBlue" pt="5px" ml="15px">
              Cliente
            </FormLabel>
            <Input
              w="15%"
              value={clientNameFilter}
              onChange={(e) => setClientNameFilter(e.target.value)}
            />
            <Spacer />
            <FormLabel color="brandBlue" htmlFor="estimated_date" ml="15px" pt="7px">
              Fecha Inicio:
            </FormLabel>
            <input
              style={{
                color: 'black',
                border: '1px solid',
                borderColor: 'inherit',
                borderRadius: '5px',
                padding: '6px',
              }}
              type="date"
              value={startFilterDate}
              onChange={e => setStartFilterDate(e.target.value)}
            />
            <FormLabel color="brandBlue" htmlFor="estimated_date" ml="15px" pt="7px">
              Fecha Fin:
            </FormLabel>
            <input
              style={{
                color: 'black',
                border: '1px solid',
                borderColor: 'inherit',
                borderRadius: '5px',
                padding: '6px',
              }}
              type="date"
              value={endFilterDate}
              onChange={e => setEndFilterDate(e.target.value)}
            />
          </Flex>
          {loading ? <LoadingPage /> : salesHasResults ? (
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Producto</Th>
                  <Th>Fecha de Entrega</Th>
                  <Th>Cliente</Th>
                  <Th>Precio</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.sales.map((sale: Sale) => (
                  <Tr key={sale.id}>
                    <Td>{sale.quotation.product ? sale.quotation.product.name : ""}</Td>
                    <Td>{sale.quotation.estimated_date.slice(0, 10)}</Td>
                    <Td>
                      <Box cursor={"pointer"} onClick={() => handleOpenClientModal(sale.client.id)}>
                        {sale.client.fullname}
                      </Box>
                    </Td>
                    <Td>{sale.quotation.price}</Td>
                    <Td>
                      <Center>
                        <Tooltip hasArrow label="Ver conversacion">
                          <ChatIcon
                            color="facebook"
                            mr="20px"
                            cursor="pointer"
                            onClick={() => {
                              router.push(
                                `/conversation/${sale.quotation.conversation.id}/name/${sale.client.fullname}`
                              );
                            }}
                          />
                        </Tooltip>
                        <Tooltip hasArrow label="Ver Venta">
                          <ViewIcon
                            color="facebook"
                            mr="20px"
                            cursor="pointer"
                            onClick={() => {
                              router.push(`/myBusiness/${currentUser}/sales/${sale.id}`);
                            }}
                          />
                        </Tooltip>
                        <Tooltip hasArrow label="Reportar Problema">
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
    </Authorization>
  );
};

export default SalesAdmin;
