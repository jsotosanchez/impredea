import { useState, useEffect } from 'react';
import { Center, Table, Tbody, Td, Th, Thead, Tooltip, Tr, Flex, Spacer, Button } from '@chakra-ui/react';
import { ChatIcon, ViewIcon, WarningIcon } from '@chakra-ui/icons';
import { useQuery } from '@apollo/client';
import { GET_SALES_BY_MAKER_ID } from '../graphql/queries';
import { LoadingPage } from '.';
import { usePagination } from '../hooks/';

const SalesAdmin = ({ id }) => {
  const { data, loading, refetch } = useQuery(GET_SALES_BY_MAKER_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);

  if (loading) return <LoadingPage />;

  return (
    <>
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
        <Button variant="solid" colorScheme="facebook" onClick={() => setCurrentPage((prev) => prev + 1)}>
          Siguiente
        </Button>
      </Flex>
    </>
  );
};

export default SalesAdmin;
