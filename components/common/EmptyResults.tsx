import { Center, Text } from '@chakra-ui/react';
const EmptyResults = (): JSX.Element => (
  <Center mt="5%">
    <Text fontSize="4xl" colorScheme="facebook">
      Tu búsqueda no tuvo ningún resultado.
    </Text>
  </Center>
);

export default EmptyResults;
