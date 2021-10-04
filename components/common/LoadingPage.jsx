import { Center, Spinner } from '@chakra-ui/react';

const LoadingPage = () => {
  return (
    <Center w="100%" mt="20%">
      <Spinner size="xl"></Spinner>
    </Center>
  );
};

export default LoadingPage;
