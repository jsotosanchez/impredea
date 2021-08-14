import { Box, Heading, Stack, Text } from '@chakra-ui/react';

const QuestionCard = ({ question }) => {
  return (
    <Box>
      <Box w="100%" bg="brandGray.100" borderRadius="10px" p="5px 15px" mt="5px">
        <Stack p="5px">
          <Heading as="h3" size="md" color="brandBlue">
            {question.user.fullname}:
          </Heading>
          <Text noOfLines="4">{question.question}</Text>
        </Stack>
      </Box>
      <Box w="95%" bg="brandGray.100" ml="5%" borderRadius="10px" mb="5px" mt="-5px">
        <Stack pl="15px" pt="5px">
          <Heading as="h3" size="sm" color="brandBlue">
            Respuesta:
          </Heading>
          <Text noOfLines="4">{question.response}</Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default QuestionCard;
