import { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Center,
  Input,
  Stack,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import client from '@/graphql/apollo-client';
import { SessionContext } from '@/context/sessionContext';
import { GET_SALE_BY_PK } from '@/graphql/queries';
import { BUCKET_FILES_URL } from '@/utils/constants';

interface Props {
  quotation: {
    product: { name: string; id: number };
    estimated_date: string;
    product_quality: { label: string };
    material: { label: string };
    quantity: number;
    client: { fullname: string };
    price: number;
    client_instructions: string;
  };
}

const Sale = ({ quotation }: Props): JSX.Element => {
  console.log(quotation);
  const router = useRouter();
  const { id: makerId, saleId } = router.query;
  const context = useContext(SessionContext);
  const user = context.getUser();

  const handleOnClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleOnClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Venta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex w="100%">
            <Stack w="40%" mr="5%">
              <Center>
                {quotation && (
                  <Image
                    src={`${BUCKET_FILES_URL}products/${quotation.product.id}`}
                    width="300px"
                    height="250px"
                    alt=""
                  />
                )}
              </Center>
              <FormLabel color="brandBlue" htmlFor="quantity">
                Cantidad:
              </FormLabel>
              <Input
                color="black"
                bg="gray.100"
                id="quantity"
                type="number"
                defaultValue={quotation.quantity}
                readOnly
              />
              <FormLabel color="brandBlue" htmlFor="quality">
                Calidad:
              </FormLabel>
              <Input color="black" bg="gray.100" id="quality" defaultValue={quotation.product_quality.label} readOnly />
              <FormLabel color="brandBlue" htmlFor="material">
                Material:
              </FormLabel>
              <Input color="black" bg="gray.100" id="material" defaultValue={quotation.material.label} readOnly />
            </Stack>
            <Stack w="45%">
              <Text size="md">{`${quotation.product.name} para ${quotation.client.fullname}`}</Text>
              <FormLabel color="brandBlue" htmlFor="material">
                Indicaciones del cliente:
              </FormLabel>
              <Textarea
                color="black"
                bg="gray.100"
                id="material"
                defaultValue={quotation.client_instructions}
                readOnly
              />

              <FormLabel color="brandBlue" htmlFor="price">
                Precio:
              </FormLabel>
              <Input color="black" bg="gray.100" id="price" type="number" readOnly defaultValue={quotation.price} />
              <FormLabel color="brandBlue" htmlFor="estimated_date">
                Fecha estimada:
              </FormLabel>
              <input
                style={{
                  color: 'black',
                  border: '1px solid',
                  borderColor: 'inherit',
                  borderRadius: '5px',
                  width: '100%',
                  padding: '6px',
                  backgroundColor: '#EDF2F7',
                }}
                id="estimated_date"
                type="date"
                readOnly
                value={quotation.estimated_date}
              />
              <FormLabel color="brandBlue" htmlFor="information">
                Informacion adicional:
              </FormLabel>
              <Textarea color="black" bg="gray.100" id="information" readOnly rows={5} />
            </Stack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export async function getServerSideProps(context: any) {
  const { saleId } = context.params;
  const { data } = await client.query({
    query: GET_SALE_BY_PK,
    variables: { id: saleId },
  });

  return {
    props: {
      quotation: data.sales_by_pk.quotation,
    },
  };
}

export default Sale;
