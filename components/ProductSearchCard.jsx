import { Flex, Stack, Text, Center, Heading, Spacer } from '@chakra-ui/react';

const ProductSearchCard = ({ main_photo, description, makerName, productName, handleOnClick }) => {
  return (
    <Flex
      bg="brandGray.100"
      h="auto"
      w="85%"
      borderRadius="10px"
      p="3"
      minH="0"
      m="2"
      cursor="pointer"
      onClick={handleOnClick}
    >
      <Center h="140px" w="20%" mr="2rem" bg="whatsapp.300">
        Picture goes here
      </Center>
      <Stack w="80%">
        <Flex mr="10%">
          <Heading as="h2" color="brandBlue" size="md" fontWeight="black">
            {productName}
          </Heading>
          <Spacer />
          <Heading as="h2" color="brandBlue" size="sm" fontWeight="normal">
            {makerName}
          </Heading>
        </Flex>
        <Text color="black" noOfLines={4}>
          {description}
        </Text>
      </Stack>
    </Flex>
  );
};

export default ProductSearchCard;
