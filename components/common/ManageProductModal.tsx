import Image from 'next/image';
import { uploadPhoto } from '@/utils/miscellaneous';
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
  Flex,
} from '@chakra-ui/react';
import { BUCKET_FILES_URL } from '@/utils/constants';
import { DeepMap, FieldError, UseFormRegister, FieldValues } from 'react-hook-form';
import { ManageProductForm } from '@/types/product';
import { DetailedHTMLProps, Dispatch, InputHTMLAttributes, SetStateAction, useState } from 'react';

interface Product {
  id: number;
  name: string;
  updated_at: string;
  description: string;
  instructions: string;
}

interface Props {
  isOpen: boolean;
  handleOnClose: () => void;
  onSubmit: () => void;
  product?: Product;
  errors: DeepMap<FieldValues, FieldError>;
  register: UseFormRegister<ManageProductForm>;
  loading?: boolean;
  setPicture?: Dispatch<
    SetStateAction<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | null>
  >;
}

const ManageProductModal = ({
  isOpen,
  handleOnClose,
  onSubmit,
  product,
  errors,
  register,
  loading,
  setPicture,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} size="4xl">
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
              <Flex>
                <Center w="40%">
                  {product && (
                    <Image src={`${BUCKET_FILES_URL}products/${product.id}`} width="400px" height="300px" alt="" />
                  )}
                  {!product && <Image src="/empty.jpeg" width="400px" height="300px" alt="" />}
                </Center>
                <Stack w="60%" pl="5%">
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
                  <FormControl>
                    <FormLabel color="brandBlue" htmlFor="logo">
                      Imagen del producto:
                    </FormLabel>
                    <input onChange={setPicture} type="file" accept="image/png, image/jpeg"></input>
                  </FormControl>
                </Stack>
              </Flex>
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
