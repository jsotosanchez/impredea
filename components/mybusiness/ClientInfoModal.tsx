import { Flex, FormLabel, Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalContent, Spinner, VStack, Text } from '@chakra-ui/react';
interface ClientModalProps {
    isOpen: boolean;
    handleOnClose: () => void;
    loading: boolean;
    client: Client
}
interface Client {
    user_by_pk: {
        fullname: string;
        location: string;
        zip_code: string;
        province: string;
        street: string;
    }
}
const ClientModal = ({ isOpen, handleOnClose, loading, client: { user_by_pk: { fullname, location, zip_code, street } } }: ClientModalProps): JSX.Element => (
    <Modal isOpen={isOpen} onClose={handleOnClose} size={"xs"}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Informacion del cliente</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {loading ? <Spinner /> : <VStack>
                    <Flex>
                        <FormLabel color="brandBlue" htmlFor="subject">
                            Nombre:
                        </FormLabel>
                        <Text>{fullname}</Text>
                    </Flex>
                    <Flex>
                        <FormLabel color="brandBlue" htmlFor="subject">
                            Localidad:
                        </FormLabel>
                        <Text>{location}</Text>
                    </Flex>
                    <Flex>
                        <FormLabel color="brandBlue" htmlFor="subject">
                            Codigo Postal:
                        </FormLabel>
                        <Text>{zip_code}</Text>
                    </Flex>
                    <Flex>
                        <FormLabel color="brandBlue" htmlFor="subject">
                            Direccion:
                        </FormLabel>
                        <Text>{street}</Text>
                    </Flex>
                </VStack>}
            </ModalBody>
        </ModalContent>
    </Modal>)

export default ClientModal