import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, HStack } from '@chakra-ui/react';
import client from '@/graphql/apollo-client';
import { CatalogAdmin, Layout, QuestionsAdmin, MakerInfoAdmin, QuotationsAdmin, SalesAdmin } from '@/components/common';
import { MY_BUSINESS_SECTIONS } from '@/utils/constants';
import { GET_QUOTATIONS_STATUSES } from '@/graphql/queries';

const MyBusiness = ({ statuses }) => {
  const router = useRouter();
  const { id } = router.query;
  const [activeSection, setActiveSection] = useState(MY_BUSINESS_SECTIONS.PRODUCTS);

  const renderSection = {
    [MY_BUSINESS_SECTIONS.PRODUCTS]: <CatalogAdmin id={id} />,
    [MY_BUSINESS_SECTIONS.QUOTATIONS]: <QuotationsAdmin id={id} statuses={statuses} />,
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

export async function getServerSideProps() {
  const { data } = await client.query({
    query: GET_QUOTATIONS_STATUSES,
  });

  return {
    props: {
      statuses: data.quotation_statuses,
    },
  };
}

export default MyBusiness;
