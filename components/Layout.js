import { Box, Spacer, Flex, Heading, Button } from '@chakra-ui/react';

export default function Layout({ children, ...rest }) {
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
          <Heading as="h1" size="md" color="white">
            Impredea
          </Heading>
        </Box>
        <Spacer />
        <Box pt="3">
          <Button variant="solid" bg="white" color="brandBlue" mr="5">
            Registrarse
          </Button>
          <Button variant="solid" bg="white" color="brandBlue">
            Ingresar
          </Button>
        </Box>
      </Flex>
      {children}
    </>
  );
}
