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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useGetProduct } from '../graphql/hooks';

const BuyProductModal = ({ isOpen, onClose, id, name }) => {
  const { data, loading } = useGetProduct(id);
  const qualities = [{ id: 1, label: 'Baja' }, { id: 2, label: 'Media' }, , { id: 3, label: 'Alta' }];

  const materials = [
    { id: 1, label: 'PLA' },
    { id: 2, label: 'ABS' },
  ];

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    console.log(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
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
                    <Box bg="tomato" height="80px" w="300px"></Box>
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
                  <FormControl isInvalid={errors.quality}>
                    <FormLabel color="brandBlue">Calidad</FormLabel>
                    <Select
                      bg="white"
                      color="black"
                      id="quality"
                      {...register('quality', {
                        required: 'Este campo es requerido',
                      })}
                    >
                      {qualities.map((option) => (
                        <option value={option.id} key={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{errors.quality && errors.quality.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.material}>
                    <FormLabel color="brandBlue">Material</FormLabel>
                    <Select
                      bg="white"
                      color="black"
                      id="material"
                      {...register('material', {
                        required: 'Este campo es requerido',
                      })}
                    >
                      {materials.map((material) => (
                        <option value={material.id} key={material.id}>
                          {material.label}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{errors.material && errors.material.message}</FormErrorMessage>
                  </FormControl>
                </Stack>
                <Stack w="45%">
                  <Text fontWeight="semibold">Descripcion del producto:</Text>
                  <Text>{data && data.product.description}</Text>
                  <Text fontWeight="semibold" pt="10px">
                    Indicaciones:
                  </Text>
                  <Text>{data && data.product.instructions}</Text>
                  <FormControl isInvalid={errors.clientIndications}>
                    <FormLabel color="brandBlue" htmlFor="clientIndications">
                      Informacion para el Maker:
                    </FormLabel>
                    <Textarea
                      bg="white"
                      color="black"
                      id="clientIndications"
                      placeholder="Por favor ingresa lo indicado por el Maker para tener un producto acorde a tus necesidades"
                      {...register('clientIndications', {
                        required: 'Este campo es requerido',
                      })}
                    />
                    <FormErrorMessage>{errors.clientIndications && errors.clientIndications.message}</FormErrorMessage>
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
        <Box bg="tomato" height="80px"></Box>
        <Text noOfLines="1" align="center">
          {name}
        </Text>
      </Box>
    </>
  );
};

export default ProductCard;
