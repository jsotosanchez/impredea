import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import LoadingPage from '../components/LoadingPage';
import { useGetQuotationsByMakerId } from '../graphql/hooks';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';

const QuotationsAdmin = ({ id }) => {
  const { data, loading } = useGetQuotationsByMakerId(id);

  if (loading) return <LoadingPage />;

  return (
    <Table variant="striped" colorScheme="gray">
      <TableCaption placement="top">Mis Cotizaciones Pendientes:</TableCaption>
      <Thead>
        <Tr>
          <Th>Producto</Th>
          <Th>Fecha de Pedido</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.quotations.map((quotation) => (
          <Tr key={quotation.id}>
            <Td>{quotation.product.name}</Td>
            <Td>{quotation.updated_at.slice(0, 10)}</Td>
            <Td>
              <EditIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
              <CloseIcon color="red" cursor="pointer" onClick={() => {}} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default QuotationsAdmin;
