import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import LoadingPage from '../../components/LoadingPage';
import { MY_BUSINESS_SECTIONS } from '../../utils/constants';
import CatalogAdmin from '../../components/CatalogAdmin';
import Layout from '../../components/Layout';
import QuestionsAdmin from '../../components/QuestionsAdmin';
import { useForm } from 'react-hook-form';
import { useGetMakerAdmin } from '../../graphql/hooks';
import { useMutation } from '@apollo/client';
import { UPDATE_MAKER_INFO } from '../../graphql/mutations';
import MakerInfoAdmin from '../../components/MakerInfoAdmin';

const QuotationsAdmin = ({ id }) => {
  console.log('quotations');
  return <>quotation admin</>;
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
    [MY_BUSINESS_SECTIONS.INFO]: <MakerInfoAdmin id={id} />,
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
