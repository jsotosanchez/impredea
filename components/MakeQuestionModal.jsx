import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
} from '@chakra-ui/react';
const MakeQuestionModal = ({ isOpen, onClose, questionText, setQuestionText, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ingresa tu pregunta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            value={questionText}
            placeholder="Que quieres saber?"
            onChange={(e) => setQuestionText(e.target.value)}
          ></Textarea>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="facebook"
            onClick={() => {
              onSubmit();
            }}
          >
            Preguntar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MakeQuestionModal;
