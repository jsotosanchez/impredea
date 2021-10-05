import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Heading, HStack } from '@chakra-ui/react';
import { MY_PURCHASES_SECTIONS } from '@/utils/constants';
import { Layout } from '@/components/common';

interface Props {
  children: JSX.Element;
  activeTab: String;
}

const MyPurchasesLayout = ({ children, activeTab }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <Box w="70%" pl="20px" mt="7%" ml="12%">
        <HStack spacing="20px" pb="20px">
          <Link href={`/myPurchases/${id}/quotations`} passHref>
            <Heading
              as="h3"
              size="md"
              color={activeTab === MY_PURCHASES_SECTIONS.QUOTATIONS ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
            >
              Cotizaciones
            </Heading>
          </Link>
          <Link href={`/myPurchases/${id}/purchases`} passHref>
            <Heading
              as="h3"
              size="md"
              color={activeTab === MY_PURCHASES_SECTIONS.PURCHASES ? 'brandBlue' : 'gray.300'}
              cursor="pointer"
            >
              Compras
            </Heading>
          </Link>
        </HStack>
        {children}
      </Box>
    </Layout>
  );
};
export default MyPurchasesLayout;
