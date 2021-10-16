import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Center, Table, Tbody, Td, Th, Thead, Tr, Tooltip, useToast, useDisclosure } from '@chakra-ui/react';
import { ChatIcon, RepeatIcon, ViewIcon, WarningIcon } from '@chakra-ui/icons';
import { useMutation, useQuery } from '@apollo/client';
import { IMPREDEA_EMAIL, MY_PURCHASES_SECTIONS } from '@/utils/constants';
import { Layout } from '@/components/myPurchases';
import { LoadingPage, ErrorPage, PaginationButtons, ReportProblemModal, EmptyResults } from '@/components/common';
import { GET_SALES_BY_CLIENT_ID } from '@/graphql/queries';
import { usePagination } from '@/hooks/index';
import { Quotation } from 'types';
import { useForm } from 'react-hook-form';
import { REPORT_PROBLEM } from '@/graphql/mutations';
import { SessionContext } from '@/context/sessionContext';
import { sendEmail } from '@/utils/miscellaneous';

interface Props {}
interface Sale {
  quotation: Quotation;
  id: string;
}

const Purchases = ({}: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const context = useContext(SessionContext);
  const { id: currentUser, email: currentUserEmail } = context.getUser();
  const [selectedSale, setSelectedSale] = useState<string>();
  const { data, loading, error, refetch } = useQuery(GET_SALES_BY_CLIENT_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);
  const { isOpen: reportProblemIsOpen, onOpen: reportProblemOnOpen, onClose: reportProblemOnClose } = useDisclosure();
  const {
    handleSubmit: handleReportProblemSubmit,
    register: registerReportProblem,
    formState: { errors: reportProblemErrors },
    reset: resetReportProblem,
  } = useForm();

  const handleReportProblemClose = () => {
    resetReportProblem();
    reportProblemOnClose();
  };

  const submitReportProblem = async (formData: any) => {
    reportProblem({ variables: { ...formData, reporter: currentUser, related_sale: selectedSale } });
    const emailBody = {
      to: IMPREDEA_EMAIL,
      from: currentUserEmail,
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
  const salesHasResults = data ? data.sales.length > 0 : false;
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
                        <ViewIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
                      </Tooltip>
                      <Tooltip hasArrow label="Repetir Compra">
                        <RepeatIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
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
