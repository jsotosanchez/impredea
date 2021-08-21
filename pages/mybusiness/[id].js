import { useState } from 'react';
import { Box, Center, Heading, HStack, Table, TableCaption, Tbody, Td, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MY_BUSINESS_SECTIONS } from '../../utils/constants';
import CatalogAdmin from '../../components/CatalogAdmin';
import Layout from '../../components/Layout';
import QuestionsAdmin from '../../components/QuestionsAdmin';
import MakerInfoAdmin from '../../components/MakerInfoAdmin';
import QuotationsAdmin from '../../components/QuotationAdmin';
import { useGetSalesByMakerId } from '../../graphql/hooks';
import LoadingPage from '../../components/LoadingPage';
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
                  <WarningIcon color="facebook" mr="20px" cursor="pointer" onClick={() => {}} />
                </Tooltip>
              </Center>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const MyBusiness = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeSection, setActiveSection] = useState(MY_BUSINESS_SECTIONS.PRODUCTS);

  const renderSection = {
    [MY_BUSINESS_SECTIONS.PRODUCTS]: <CatalogAdmin id={id} />,
    [MY_BUSINESS_SECTIONS.QUOTATIONS]: <QuotationsAdmin id={id} />,
    [MY_BUSINESS_SECTIONS.QUESTIONS]: <QuestionsAdmin id={id} />,
    [MY_BUSINESS_SECTIONS.INFO]: <MakerInfoAdmin id={id} />,
    [MY_BUSINESS_SECTIONS.SALES]: <SalesAdmin id={id} />,
  };

  return (
    <Layout>
      <Box w="70%" pl="20px" mt="7%" ml="12%">
        <HStack spacing="20px" pb="20px">
          <Heading
            as="h3"
            size="md"
            color={activeSection === MY_BUSINESS_SECTIONS.PRODUCTS ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_BUSINESS_SECTIONS.PRODUCTS)}
          >
            Catalogo
          </Heading>
          <Heading
            as="h3"
            size="md"
            color={activeSection === MY_BUSINESS_SECTIONS.QUOTATIONS ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_BUSINESS_SECTIONS.QUOTATIONS)}
          >
            Cotizaciones
          </Heading>
          <Heading
            as="h3"
            size="md"
            color={activeSection === MY_BUSINESS_SECTIONS.QUESTIONS ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_BUSINESS_SECTIONS.QUESTIONS)}
          >
            Preguntas
          </Heading>
          <Heading
            as="h3"
            size="md"
            color={activeSection === MY_BUSINESS_SECTIONS.SALES ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_BUSINESS_SECTIONS.SALES)}
          >
            Ventas
          </Heading>
          <Heading
            as="h3"
            size="md"
            color={activeSection === MY_BUSINESS_SECTIONS.INFO ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_BUSINESS_SECTIONS.INFO)}
          >
            Mis Datos
          </Heading>
        </HStack>
        {renderSection[activeSection]}
      </Box>
    </Layout>
  );
};

export default MyBusiness;
