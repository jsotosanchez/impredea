import { Center, Heading, Text, Stack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface Props {
  route?: string;
}

const ErrorPage = ({ route = '/' }: Props): JSX.Element => {
  const router = useRouter();
  return (
    <Center w="100%" mt="20%">
      <Stack>
        <Heading as="h1" size="md">
          Lo sentimos, ha ocurrido un error.
        </Heading>
        <Text>Por favor intenta mas tarde</Text>
        <Button variant="link" colorScheme="facebook" onClick={() => router.push(route)}>
          Volver a inicio
        </Button>
      </Stack>
    </Center>
  );
};

export default ErrorPage;
