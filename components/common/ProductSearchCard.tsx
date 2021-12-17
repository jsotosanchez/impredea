import Image from 'next/image';
import { Flex, Stack, Text, Heading, Spacer, Box } from '@chakra-ui/react';
import { BUCKET_FILES_URL } from '@/utils/constants';

interface Props {
  main_photo: number;
  description: string;
  makerName: string;
  productName: string;
  handleOnClick: () => void;
}

const ProductSearchCard = ({ main_photo, description, makerName, productName, handleOnClick }: Props): JSX.Element => {
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
        <Image priority={true} src={`${BUCKET_FILES_URL}products/${main_photo}`} width="300px" height="200px" alt="" />
      </Box>
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
