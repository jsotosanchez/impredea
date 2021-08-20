import { useState } from 'react';
import { Box, Heading, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MY_PURCHASES_SECTIONS } from '../../utils/constants';
import Layout from '../../components/Layout';

const Purchases = () => <>purchases</>;
const ClientQuotations = () => <>ClientQuotations</>;

const MyBusiness = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeSection, setActiveSection] = useState(MY_PURCHASES_SECTIONS.QUOTATIONS);

  const renderSection = {
    [MY_PURCHASES_SECTIONS.PURCHASES]: <Purchases id={id} />,
    [MY_PURCHASES_SECTIONS.QUOTATIONS]: <ClientQuotations id={id} />,
  };

  return (
    <Layout>
      <Box w="70%" pl="20px" mt="7%" ml="12%">
        <HStack spacing="20px" pb="20px">
          <Heading
            as="h3"
            size="md"
            color={activeSection === MY_PURCHASES_SECTIONS.QUOTATIONS ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_PURCHASES_SECTIONS.QUOTATIONS)}
          >
            Cotizaciónes
          </Heading>
          <Heading
            as="h3"
            size="md"
            color={activeSection === MY_PURCHASES_SECTIONS.PURCHASES ? 'brandBlue' : 'gray.300'}
            cursor="pointer"
            onClick={() => setActiveSection(MY_PURCHASES_SECTIONS.PURCHASES)}
          >
            Compras
          </Heading>
        </HStack>
        {renderSection[activeSection]}
      </Box>
    </Layout>
  );
};

export default MyBusiness;
