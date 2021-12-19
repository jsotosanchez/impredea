import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { Box, Spacer, Flex, Button, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SessionContext } from '@/context/sessionContext';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const router = useRouter();
  const context = useContext(SessionContext);
  const currentUser = context.getUser();

  return (
    <>
      <Flex
        pos="fixed"
        as="header"
        top="0"
        bg="brandBlue"
        zIndex="banner"
        left="0"
        right="0"
        borderBottomWidth="1px"
        width="full"
        height="4rem"
        paddingLeft="20"
        paddingRight="20"
      >
        <Flex p="4" color="black">
          <Image priority={true} src="/logo.png" width="30" height="50" alt="" />
          <Heading as="h1" size="md" color="white" onClick={() => router.push('/')} cursor="pointer" pt="3px">
            Impredea
          </Heading>
        </Flex>
        <Spacer />
        <Box pt="4">
          {currentUser && currentUser.maker_active && (
            <Button
              variant="link"
              colorScheme="white"
              color="white"
              mr="5"
              onClick={() => router.push(`/myBusiness/${currentUser.id}/catalog`)}
            >
              Mi negocio
            </Button>
          )}
          <Link href={`/marketplace`} passHref>
            <Button
              variant="link"
              colorScheme="white"
              color="white"
              mr="5"
            >
              Marketplace
            </Button>
          </Link>
          {currentUser && currentUser.id && (
            <Button
              variant="link"
              colorScheme="white"
              color="white"
              mr="5"
              onClick={() => router.push(`/myPurchases/${currentUser.id}/purchases`)}
            >
              Mis Compras
            </Button>
          )}
          {currentUser && currentUser.id && (
            <Button
              variant="link"
              colorScheme="white"
              color="white"
              mr="5"
              onClick={() => router.push(`/myProfile/${currentUser.id}`)}
            >
              Mi perfil
            </Button>
          )}
          {currentUser && !currentUser.id && (
            <>
              <Button
                variant="link"
                colorScheme="white"
                color="white"
                mr="5"
                onClick={() => window.location.replace('/api/auth/login')}
              >
                Registrarme
              </Button>
              <Button
                variant="link"
                colorScheme="white"
                color="white"
                mr="5"
                onClick={() => window.location.replace('/api/auth/login')}
              >
                Contectarse
              </Button>
            </>
          )}
          {currentUser && currentUser.id && (
            <Button
              variant="link"
              colorScheme="white"
              color="white"
              mr="5"
              onClick={() => window.location.replace('/api/auth/logout')}
            >
              Desconectarse
            </Button>
          )}
        </Box>
      </Flex>
      {children}
    </>
  );
}
