import { Center, Heading } from '@chakra-ui/react';

const ErrorPage = () => {
  return (
    <Center w="100%" mt="20%">
      <Heading as="h1" size="md">
        Lo sentimos, ha ocurrido un error.
      </Heading>
      <Text>Por favor intenta mas tarde</Text>
    </Center>
  );
};

export default ErrorPage;
