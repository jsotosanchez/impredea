import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { RenderRating } from '@/components/common';

interface ClientType {
  fullname: String;
}

interface Props {
  client: ClientType;
  rating: Number;
  text: String;
}

const ReviewCard = ({ client, rating, text }: Props): JSX.Element => {
  return (
    <Box w="100%" bg="brandGray.100" borderRadius="10px" p="5px 15px" mt="5px">
      <Flex>
        <Heading as="h2" size="md" p="5px" color="brandBlue">
          {client.fullname}
        </Heading>
        <Spacer />
        <RenderRating rating={rating} />
      </Flex>
      <Text>{text}</Text>
    </Box>
  );
};

export default ReviewCard;
