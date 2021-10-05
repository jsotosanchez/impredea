import { useRouter } from 'next/router';
import { Button, Center, Flex, Table, Tbody, Td, Th, Thead, Tr, Tooltip, Spacer } from '@chakra-ui/react';
import { ChatIcon, RepeatIcon, ViewIcon, WarningIcon } from '@chakra-ui/icons';
import { useQuery } from '@apollo/client';
import { MY_PURCHASES_SECTIONS } from '@/utils/constants';
import { Layout } from '@/components/myPurchases';
import { LoadingPage, ErrorPage } from '@/components/common';
import { GET_SALES_BY_CLIENT_ID } from '@/graphql/queries';
import { usePagination } from '@/hooks/index';
import { Quotation } from 'types';

interface Props {}
interface Sale {
  quotation: Quotation;
  id: string;
}

const Purchases = ({}: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error, refetch } = useQuery(GET_SALES_BY_CLIENT_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);

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
            <Button
              size="md"
              variant="outline"
              colorScheme="facebook"
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
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
    </Layout>
  );
};

export default Purchases;
