import { useRouter } from 'next/router';
import {
  Center,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Flex,
  Spacer,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ChatIcon, ViewIcon, WarningIcon } from '@chakra-ui/icons';
import { useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { GET_SALES_BY_MAKER_ID } from '@/graphql/queries';
import { ErrorPage, ReportProblemModal, LoadingPage, PaginationButtons } from '@/components/common';
import { usePagination } from '@/hooks/index';
import { REPORT_PROBLEM } from '@/graphql/mutations';
import { SessionContext } from '@/context/sessionContext';
import { Layout } from '@/components/mybusiness';
import { MY_BUSINESS_SECTIONS } from '@/utils/constants';

const SalesAdmin = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const context = useContext(SessionContext);
  const { id: currentUser } = context.getUser();
  const [selectedSale, setSelectedSale] = useState();
  const { data, loading, refetch, error } = useQuery(GET_SALES_BY_MAKER_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);
  const {
    handleSubmit: handleReportProblemSubmit,
    register: registerReportProblem,
    formState: { errors: reportProblemErrors },
    reset: resetReportProblem,
  } = useForm();

  const salesHasResults = data ? data.sales.length > 0 : false;
  const { isOpen: reportProblemIsOpen, onOpen: reportProblemOnOpen, onClose: reportProblemOnClose } = useDisclosure();

  const handleReportProblemClose = () => {
    resetReportProblem();
    reportProblemOnClose();
  };

  const submitReportProblem = (formData) => {
    reportProblem({ variables: { ...formData, reporter: currentUser, related_sale: selectedSale } });
    // TODO: SEND EMAIL TO IMPREDEA HELP DESK
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

  if (error) return <ErrorPage route={`/`} />;
  if (loading)
    return (
      <Layout activeHeader={MY_BUSINESS_SECTIONS.SALES}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MY_BUSINESS_SECTIONS.SALES}>
      <ReportProblemModal
        isOpen={reportProblemIsOpen}
        handleOnClose={handleReportProblemClose}
        onSubmit={handleReportProblemSubmit(submitReportProblem)}
        errors={reportProblemErrors}
        register={registerReportProblem}
      />
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
          {data?.sales.map((sale) => (
            <Tr key={sale.id}>
              <Td>{sale.quotation.product.name}</Td>
              <Td>{sale.quotation.estimated_date.slice(0, 10)}</Td>
              <Td>{sale.quotation.client.fullname}</Td>
              <Td>{sale.quotation.price}</Td>
              <Td>
                <Center>
                  <Tooltip hasArrow label="Ver conversacion">
                    <ChatIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
                  </Tooltip>
                  <Tooltip hasArrow label="Ver Venta">
                    <ViewIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
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
      <PaginationButtons currentPage={currentPage} hasResults={salesHasResults} setCurrentPage={setCurrentPage} />
    </Layout>
  );
};

export default SalesAdmin;
