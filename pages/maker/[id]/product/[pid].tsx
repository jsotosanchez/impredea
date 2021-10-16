import { useContext, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import {
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
import { useForm } from 'react-hook-form';
import { CREATE_CONVERSATION, REQUEST_QUOTATION } from '@/graphql/mutations';
import { SessionContext } from '@/context/sessionContext';
import { GET_PRODUCT_BY_ID } from '@/graphql/queries';
import { sendEmail } from '@/utils/miscellaneous';
import { BUCKET_FILES_URL, IMPREDEA_EMAIL } from '@/utils/constants';

interface Material {
  id: string;
  label: string;
}

interface Quality {
  id: string;
  label: string;
}

interface Form {
  quantity: number;
  qualityId: number;
  materialId: number;
  clientInstructions: string;
}

interface Props {}

const Product = ({}: Props): JSX.Element => {
  const router = useRouter();
  const { id: makerId, pid } = router.query;
  const toast = useToast();
  const { data, loading, refetch } = useQuery(GET_PRODUCT_BY_ID, { variables: { id: pid } });
  const context = useContext(SessionContext);
  const user = context.getUser();

  const [requestQuotation, { data: mutationResultData }] = useMutation(REQUEST_QUOTATION, {
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

  const [createConversation] = useMutation(CREATE_CONVERSATION, {
    onCompleted: () => {
      handleOnClose();
    },
  });

  const qualities: Quality[] = [
    { id: '1', label: 'Baja' },
    { id: '2', label: 'Media' },
    { id: '3', label: 'Alta' },
  ];

  const materials: Material[] = [
    { id: '1', label: 'PLA' },
    { id: '2', label: 'ABS' },
  ];

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Form>();

  const onSubmit = (formData: Object) => {
    requestQuotation({ variables: { ...formData, productId: pid, clientId: user.id, makerId } });
    try {
      const emailBody = {
        to: user.email,
        from: IMPREDEA_EMAIL,
        subject: `Te han solicitado una cotizacion!`,
        message: `Un cliente te ha pedidoa una cotizacion. Recuerda responderle cuanto antes.`,
      };

      sendEmail(emailBody);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnClose = () => {
    reset();
    router.back();
  };

  useEffect(() => {
    refetch();
  }, [pid, refetch]);

  useEffect(() => {
    if (mutationResultData)
      createConversation({ variables: { quotationId: mutationResultData.insert_quotations_one.id } });
  }, [mutationResultData, createConversation]);

  return (
    <Modal isOpen={true} onClose={handleOnClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{data && data.product_by_pk.name}</ModalHeader>
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
                    <Image src={`${BUCKET_FILES_URL}products/${pid}`} width="280px" height="250px" alt="" />
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
                  <Text>{data && data.product_by_pk.description}</Text>
                  <Text fontWeight="semibold" pt="10px">
                    Indicaciones:
                  </Text>
                  <Text>{data && data.product_by_pk.instructions}</Text>
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

export default Product;
