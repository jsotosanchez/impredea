import { useContext } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Spinner,
  Center,
  FormControl,
  Input,
  InputGroup,
  InputRightAddon,
  FormErrorMessage,
} from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { SessionContext } from '@/context/sessionContext';
import { useSubscription } from '@apollo/client';
import { MESSAGES_SUBSCRIPTION } from '@/graphql/subscriptions';

interface Message {
  sender_id: number;
  text: string;
  created_at: string;
  read_at: string;
  id: string;
}

interface Form {
  message: string;
}
interface MessageProps {
  message: string;
  authorIsMe: boolean;
}

const Message = ({ message, authorIsMe }: MessageProps) => (
  <>
    <Flex direction={authorIsMe ? 'row-reverse' : 'row'} p="3px" my="1px" mx="5px">
      <Box p="3px 20px 3px 20px" borderRadius="20px" bg={'gray.100'}>
        <Text fontWeight="semibold" color={'#000000'}>
          {message}
        </Text>
      </Box>
    </Flex>
  </>
);

interface Props {}

const Conversation = ({}: Props): JSX.Element => {
  const router = useRouter();
  const { id: conversationId, name } = router.query;
  const context = useContext(SessionContext);
  const user = context.getUser();
  // const messages: any[] = [{ messageText: 'hi', user: { email: 'fake' } }];

  const handleOnClose = () => {
    router.back();
  };

  const { data, loading } = useSubscription(MESSAGES_SUBSCRIPTION, { variables: { conversationId } });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Form>();

  const onSubmit = (formData: Form) => {
    console.log(formData);
    console.log('sending message');
    reset();
  };
  return (
    <Modal isOpen={true} onClose={handleOnClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text size="xs">Estas hablando con: {name}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            {false ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Box
                minH="30em"
                maxH="30em"
                overflowY="scroll"
                css={{
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}
              >
                {data &&
                  data.messages.map((msg: Message) => (
                    <Message key={msg.id} message={msg.text} authorIsMe={user?.id === msg.sender_id} />
                  ))}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <FormControl id="text">
              <InputGroup>
                <Input
                  placeholder="Escribe aqui tu mensaje."
                  {...register('message', {
                    required: 'No puedes enviar mensajes vacios.',
                  })}
                ></Input>
                <InputRightAddon>
                  <Button type="submit" variant="ghost">
                    <ArrowUpIcon />
                  </Button>
                </InputRightAddon>
              </InputGroup>
              <FormErrorMessage>{errors.message && errors.message.message}</FormErrorMessage>
            </FormControl>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default Conversation;
