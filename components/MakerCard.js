import { Flex, Stack, Text, Center, Heading } from '@chakra-ui/react';
import RenderRating from './RenderRating';

const MakerCard = ({ name, description, rating, sales, handleOnClick }) => {
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
      <Stack w="50%">
        <Heading as="h2" color="brandBlue" size="md" fontWeight="black">
          {name}
        </Heading>
        <Text color="black" noOfLines={4}>
          {description}
        </Text>
      </Stack>
      <Stack w="auto" pl="5%">
        <RenderRating rating={rating} />
        {/* <Text color="black">Ventas: {sales}</Text> */}
      </Stack>
    </Flex>
  );
};

export default MakerCard;
