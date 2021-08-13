import { Box, Text } from '@chakra-ui/react';

const ProductCard = ({ id, name }) => {
  const handleOnClick = () => {
    alert(id);
  };
  return (
    <Box onClick={handleOnClick} cursor="pointer">
      <Box bg="tomato" height="80px"></Box>
      <Text noOfLines="1" align="center">
        {name}
      </Text>
    </Box>
  );
};

export default ProductCard;
