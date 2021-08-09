import { Flex, Stack, Text, Center, Heading, HStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const RenderRating = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(0);
  }
  return (
    <HStack color="brandBlue">
      {stars.map(() => (
        <StarIcon />
      ))}
    </HStack>
  );
};

const MakerCard = ({ name, description, rating, sales, handleOnClick, id }) => {
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
        <Text color="black">Ventas: {sales}</Text>
      </Stack>
    </Flex>
  );
};

export default MakerCard;
