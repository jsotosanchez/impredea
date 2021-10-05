import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Heading, HStack } from '@chakra-ui/react';
import { Layout } from '@/components/common';
import { MY_BUSINESS_SECTIONS } from '@/utils/constants';

interface Props {
  children: JSX.Element;
  activeHeader: String;
}

const MyBusinessLayout = ({ children, activeHeader }: Props): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <Box w="70%" pl="20px" mt="7%" ml="12%">
        <HStack spacing="20px" pb="20px">
          <Link href={`/mybusiness/${id}/catalog`} passHref>
            <Heading
              as="h3"
              size="md"
              color={activeHeader === MY_BUSINESS_SECTIONS.PRODUCTS ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
            >
              Catalogo
            </Heading>
          </Link>
          <Link href={`/mybusiness/${id}/quotations`} passHref>
            <Heading
              as="h3"
              size="md"
              color={activeHeader === MY_BUSINESS_SECTIONS.QUOTATIONS ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
            >
              Cotizaciones
            </Heading>
          </Link>
          <Link href={`/mybusiness/${id}/questions`} passHref>
            <Heading
              as="h3"
              size="md"
              color={activeHeader === MY_BUSINESS_SECTIONS.QUESTIONS ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
            >
              Preguntas
            </Heading>
          </Link>
          <Link href={`/mybusiness/${id}/sales`} passHref>
            <Heading
              as="h3"
              size="md"
              color={activeHeader === MY_BUSINESS_SECTIONS.SALES ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
            >
              Ventas
            </Heading>
          </Link>
          <Link href={`/mybusiness/${id}/profile`} passHref>
            <Heading
              as="h3"
              size="md"
              color={activeHeader === MY_BUSINESS_SECTIONS.INFO ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
            >
              Mis Datos
            </Heading>
          </Link>
        </HStack>
        {children}
      </Box>
    </Layout>
  );
};

export default MyBusinessLayout;
