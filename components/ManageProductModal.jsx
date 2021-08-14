import {
  Box,
  Button,
  Input,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  FormControl,
  Textarea,
  FormErrorMessage,
  Spinner,
  Center,
} from '@chakra-ui/react';

const ManageProductModal = ({ isOpen, handleOnClose, onSubmit, product, errors, register, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Administrar Producto</ModalHeader>
        <ModalCloseButton />
        {loading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={onSubmit}>
            <ModalBody>
              <Box>
                <Stack w="40%"></Stack>
                <FormControl isInvalid={errors.name}>
                  <FormLabel color="brandBlue" htmlFor="name">
                    Nombre del producto:
                  </FormLabel>
                  <Input
                    bg="white"
                    color="black"
                    id="name"
                    defaultValue={product ? product.name : ''}
                    {...register('name', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.description}>
                  <FormLabel color="brandBlue" htmlFor="description">
                    Descripcion:
                  </FormLabel>
                  <Textarea
                    bg="white"
                    color="black"
                    placeholder="Una buena descripcion atrae mas compradores..."
                    defaultValue={product ? product.description : ''}
                    id="description"
                    {...register('description', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.instructions}>
                  <FormLabel color="brandBlue" htmlFor="instructions">
                    Indicaciones para el cliente:
                  </FormLabel>
                  <Textarea
                    bg="white"
                    color="black"
                    placeholder="La informacion del cliente necesitas para hacer este producto"
                    defaultValue={product ? product.instructions : ''}
                    id="instructions"
                    {...register('instructions', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.instructions && errors.instructions.message}</FormErrorMessage>
                </FormControl>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="facebook">
                Guardar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ManageProductModal;
