import { Center, Table, TableCaption, Tbody, Td, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { useGetSalesByMakerId } from '../graphql/hooks';
import LoadingPage from '../components/LoadingPage';
import { ChatIcon, ViewIcon, WarningIcon } from '@chakra-ui/icons';

const SalesAdmin = ({ id }) => {
  const { data, loading, refetch } = useGetSalesByMakerId(id);

  if (loading) return <LoadingPage />;

  return (
    <Table variant="striped" colorScheme="gray">
      <TableCaption placement="top">Mis Compras</TableCaption>
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
  );
};

export default SalesAdmin;
