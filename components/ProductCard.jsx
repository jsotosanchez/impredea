import { useMutation } from '@apollo/client';
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
  useDisclosure,
  Button,
  Flex,
  Stack,
  Spinner,
  Center,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { SessionContext } from '../context/sessionContext';
import { useGetProduct } from '../graphql/hooks';
import { REQUEST_QUOTATION } from '../graphql/mutations';

const BuyProductModal = ({ isOpen, onClose, id, name }) => {
  const router = useRouter();
  const { id: makerId } = router.query;
  const toast = useToast();
  const { data, loading } = useGetProduct(id);
  const context = useContext(SessionContext);
  const user = context.getUser();

  const [requestQuotation, { loadingRequestQuotation }] = useMutation(REQUEST_QUOTATION, {
    onCompleted: () => {
      toast({
        title: 'Se ha enviado tu solicitud al Maker',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Ha ocurrido un error',
        description: 'Por favor intenta mas tarde',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const qualities = [{ id: 1, label: 'Baja' }, { id: 2, label: 'Media' }, , { id: 3, label: 'Alta' }];

  const materials = [
    { id: 1, label: 'PLA' },
    { id: 2, label: 'ABS' },
  ];

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (formData) => {
    requestQuotation({ variables: { ...formData, productId: id, clientId: user.id, makerId } });
    handleOnClose();
  };

  const handleOnClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            {loading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Flex w="100%">
                <Stack w="40%" mr="5%">
                  <Center>
                    <Box bg="tomato" height="300px" w="250px"></Box>
                  </Center>
                  <FormControl isInvalid={errors.quantity}>
                    <FormLabel color="brandBlue" htmlFor="quantity">
                      Cantidad
                    </FormLabel>
                    <Input
                      bg="white"
                      color="black"
                      id="quantity"
                      type="number"
                      defaultValue={1}
                      {...register('quantity', {
                        required: 'Este campo es requerido',
                      })}
                    />
                    <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.qualityId}>
                    <FormLabel color="brandBlue">Calidad</FormLabel>
                    <Select
                      bg="white"
                      color="black"
                      id="qualityId"
                      {...register('qualityId', {
                        required: 'Este campo es requerido',
                      })}
                    >
                      {qualities.map((option) => (
                        <option value={option.id} key={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{errors.qualityId && errors.qualityId.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.materialId}>
                    <FormLabel color="brandBlue">Material</FormLabel>
                    <Select
                      bg="white"
                      color="black"
                      id="materialId"
                      {...register('materialId', {
                        required: 'Este campo es requerido',
                      })}
                    >
                      {materials.map((material) => (
                        <option value={material.id} key={material.id}>
                          {material.label}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{errors.materialId && errors.materialId.message}</FormErrorMessage>
                  </FormControl>
                </Stack>
                <Stack w="45%">
                  <Text fontWeight="semibold">Descripcion del producto:</Text>
                  <Text>{data && data.product.description}</Text>
                  <Text fontWeight="semibold" pt="10px">
                    Indicaciones:
                  </Text>
                  <Text>{data && data.product.instructions}</Text>
                  <FormControl isInvalid={errors.clientInstructions}>
                    <FormLabel color="brandBlue" htmlFor="clientInstructions">
                      Informacion para el Maker:
                    </FormLabel>
                    <Textarea
                      bg="white"
                      color="black"
                      id="clientInstructions"
                      placeholder="Por favor ingresa lo indicado por el Maker para tener un producto acorde a tus necesidades"
                      {...register('clientInstructions', {
                        required: 'Este campo es requerido',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.clientInstructions && errors.clientInstructions.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="facebook" type="submit">
              Pedir Cotizacion
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const ProductCard = ({ id, name }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <BuyProductModal id={id} isOpen={isOpen} onOpen={onOpen} onClose={onClose} name={name} />
      <Box onClick={onOpen} cursor="pointer">
        <Box bg="red.100" height="180px"></Box>
        <Text noOfLines="1" align="center">
          {name}
        </Text>
      </Box>
    </>
  );
};

export default ProductCard;
