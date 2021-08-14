import { useState } from 'react';
import { Box, Heading, HStack, Table, Thead, Tbody, Tr, Th, Td, TableCaption } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import LoadingPage from '../../components/LoadingPage';
import { MY_BUSINESS_SECTIONS } from '../../utils/constants';
import { useGetQuestionsByMakerId } from '../../graphql/hooks';
import { CloseIcon, ViewIcon } from '@chakra-ui/icons';
import CatalogAdmin from '../../components/CatalogAdmin';
import Layout from '../../components/Layout';

const QuotationsAdmin = ({ id }) => {
  console.log('quotations');
  return <>quotation admin</>;
};

const QuestionsAdmin = ({ id }) => {
  const { data, loading } = useGetQuestionsByMakerId(id);

  if (loading) return <LoadingPage />;

  return (
    <Box mt="10%">
      <Table variant="striped" colorScheme="gray">
        <TableCaption placement="top">Preguntas pendientes:</TableCaption>
        <Thead>
          <Tr>
            <Th>Cliente</Th>
            <Th>Realizada el:</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.questions.map((question) => (
            <Tr key={question.id}>
              <Td>{question.user.fullname}</Td>
              <Td>{question.created_at}</Td>
              <Td>
                <ViewIcon color="facebook" mr="20px" cursor="pointer" />
                <CloseIcon color="red" cursor="pointer" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const InfoAdmin = () => {
  return <>Info admin</>;
};

const SalesAdmin = () => {
  return <>Sales admin</>;
};

const MyBusiness = () => {
  const router = useRouter();
  const { id } = router.query;
  const loading = false;
  const [activeSection, setActiveSection] = useState(MY_BUSINESS_SECTIONS.PRODUCTS);

  const renderSection = {
    [MY_BUSINESS_SECTIONS.PRODUCTS]: <CatalogAdmin id={id} />,
    [MY_BUSINESS_SECTIONS.QUOTATIONS]: <QuotationsAdmin id={id} />,
    [MY_BUSINESS_SECTIONS.QUESTIONS]: <QuestionsAdmin id={id} />,
    [MY_BUSINESS_SECTIONS.INFO]: <InfoAdmin id={id} />,
    [MY_BUSINESS_SECTIONS.SALES]: <SalesAdmin id={id} />,
  };

  if (loading) return <LoadingPage />;

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
            color={activeSection === MY_BUSINESS_SECTIONS.INFO ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_BUSINESS_SECTIONS.INFO)}
          >
            Informacion
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
        </HStack>
        {renderSection[activeSection]}
      </Box>
    </Layout>
  );
};

export default MyBusiness;
