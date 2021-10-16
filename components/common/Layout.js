import { useContext } from 'react';
import Image from 'next/image';
import { Box, Spacer, Flex, Button, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SessionContext } from '@/context/sessionContext';

export default function Layout({ children, ...rest }) {
  const router = useRouter();
  const context = useContext(SessionContext);

  const { id, maker_active } = context.getUser();

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
        {...rest}
      >
        <Flex p="4" color="black">
          <Image src="/logo.png" width="30" height="50" alt="" />
          <Heading as="h1" size="md" color="white" onClick={() => router.push('/')} cursor="pointer" pt="3px">
            Impredea
          </Heading>
        </Flex>
        <Spacer />
        <Box pt="4">
          {maker_active && (
            <Button
              variant="link"
              colorScheme="white"
              color="white"
              mr="5"
              onClick={() => router.push(`/mybusiness/${id}/catalog`)}
            >
              Mi negocio
            </Button>
          )}
          {id && (
            <Button
              variant="link"
              colorScheme="white"
              color="white"
              mr="5"
              onClick={() => router.push(`/myPurchases/${id}/purchases`)}
            >
              Mis Compras
            </Button>
          )}
          {id && (
            <Button
              variant="link"
              colorScheme="white"
              color="white"
              mr="5"
              onClick={() => router.push(`/myProfile/${id}`)}
            >
              Mi perfil
            </Button>
          )}
          {!id && (
            <>
              <Button variant="link" colorScheme="white" color="white" mr="5">
                {/* TODO: change for next/link */}
                <a href="/api/auth/login">Registrarme</a>
              </Button>
              <Button variant="link" colorScheme="white" color="white" mr="5">
                {/* TODO: change for next/link */}
                <a href="/api/auth/login">Contectarse</a>
              </Button>
            </>
          )}
          {id && (
            <Button variant="link" colorScheme="white" color="white" mr="5">
              {/* TODO: change for next/link */}
              <a href="/api/auth/logout">Desconectarse</a>
            </Button>
          )}
        </Box>
      </Flex>
      {children}
    </>
  );
}
