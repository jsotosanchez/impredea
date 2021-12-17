import { Flex, Stack, Text, Box, Heading } from '@chakra-ui/react';
import RenderRating from './RenderRating';
import Image from 'next/image';
import { BUCKET_FILES_URL } from '@/utils/constants';
interface Props {
  name: string;
  description: string;
  rating: number;
  // sales: number;
  handleOnClick: () => void;
  picKey: string;
}

const MakerCard = ({ name, description, rating, handleOnClick, picKey }: Props): JSX.Element => {
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
      <Box mr="15px">
        <Image priority={true} src={`${BUCKET_FILES_URL}${picKey}`} width="200px" height="140px" alt="" />
      </Box>
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
