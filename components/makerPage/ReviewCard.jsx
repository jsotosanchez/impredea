import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { RenderRating } from '../common';

const ReviewCard = ({ review }) => {
  return (
    <Box w="100%" bg="brandGray.100" borderRadius="10px" p="5px 15px" mt="5px">
      <Flex>
        <Heading as="h2" size="md" p="5px" color="brandBlue">
          {review.client.fullname}
        </Heading>
        <Spacer />
        <RenderRating rating={review.rating} />
      </Flex>
      <Text>{review.text}</Text>
    </Box>
  );
};

export default ReviewCard;