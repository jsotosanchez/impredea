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
  FormControl,
  Textarea,
  FormErrorMessage,
} from '@chakra-ui/react';
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  handleOnClose: () => void;
  onSubmit: any;
  errors: DeepMap<FieldValues, FieldError>;
  register: UseFormRegister<FieldValues>;
}

const ReportProbleModal = ({ isOpen, handleOnClose, onSubmit, errors, register }: Props): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reportar Problema</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={onSubmit}>
          <ModalBody>
            <Box>
              <FormControl isInvalid={errors.subject}>
                <FormLabel color="brandBlue" htmlFor="subject">
                  Cual es el problema?
                </FormLabel>
                <Input
                  bg="white"
                  color="black"
                  id="subject"
                  placeholder="Mi cliente..."
                  {...register('subject', {
                    required: 'Este campo es requerido',
                  })}
                />
                <FormErrorMessage>{errors.subject && errors.subject.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.description}>
                <FormLabel color="brandBlue" htmlFor="description">
                  Descripcion:
                </FormLabel>
                <Textarea
                  bg="white"
                  color="black"
                  placeholder="Describe el problema a detalle para poder ayudarte mejor"
                  id="description"
                  {...register('description', {
                    required: 'Este campo es requerido',
                  })}
                />
                <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="facebook">
              Reportar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ReportProbleModal;
