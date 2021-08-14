import { Center, Spinner } from '@chakra-ui/react';

const LoadingPage = () => {
  return (
    <Center w="100%" h="100vh">
      <Spinner size="xl"></Spinner>
    </Center>
  );
};

export default LoadingPage;
