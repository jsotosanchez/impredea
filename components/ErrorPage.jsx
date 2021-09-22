import { Center, Heading, Text, Stack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const ErrorPage = () => {
  const router = useRouter();
  return (
    <Center w="100%" mt="20%">
      <Stack>
        <Heading as="h1" size="md">
          Lo sentimos, ha ocurrido un error.
        </Heading>
        <Text>Por favor intenta mas tarde</Text>
        <Button variant="link" colorScheme="facebook" onClick={() => router.push('/')}>
          Volver a inicio
        </Button>
      </Stack>
    </Center>
  );
};

export default ErrorPage;
