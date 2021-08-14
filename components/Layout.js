import { Box, Spacer, Flex, Heading, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function Layout({ children, ...rest }) {
  const router = useRouter();
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
        <Box p="4" color="black">
          <Heading as="h1" size="md" color="white" onClick={() => router.push('/')} cursor="pointer">
            Impredea
          </Heading>
        </Box>
        <Spacer />
        <Box pt="4">
          <Button
            variant="link"
            colorScheme="white"
            color="white"
            mr="5"
            onClick={() => router.push(`/mybusiness/${1}`)}
          >
            Mi negocio
          </Button>
          <Button
            variant="link"
            colorScheme="white"
            color="white"
            mr="5"
            onClick={() => router.push(`/myProfile/${1}`)}
          >
            Mi perfil
          </Button>
          <Button variant="link" colorScheme="white" color="white" mr="5">
            Registrarse
          </Button>
          <Button variant="link" colorScheme="white" color="white" mr="5">
            Ingresar
          </Button>
        </Box>
      </Flex>
      {children}
    </>
  );
}
