import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import {
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
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Select,
    Textarea,
    useToast,
    Tooltip,
} from '@chakra-ui/react';
import { Authorization } from '@/components/common';
import { CREATE_CONVERSATION, REQUEST_QUOTATION } from '@/graphql/mutations';
import { SessionContext } from '@/context/sessionContext';
import { sendEmail, uploadFile } from '@/utils/miscellaneous';
import { IMPREDEA_EMAIL, logInToastId } from '@/utils/constants';

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
    file_url: string;
}

interface Props { }

const Product = ({ }: Props): JSX.Element => {
    const router = useRouter();
    const { id: makerId } = router.query;
    const toast = useToast();
    const context = useContext(SessionContext);
    const user = context.getUser();
    const [file, setFile] = useState<ChangeEvent<HTMLInputElement>>()

    const [requestQuotation, { data: mutationResultData }] = useMutation(REQUEST_QUOTATION, {
        onCompleted: () => {
            toast({
                title: 'Se ha enviado tu solicitud al Maker',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            console.log(file)
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
        if (!user) {
            if (!toast.isActive(logInToastId)) {
                toast({
                    id: logInToastId,
                    title: 'Tienes que estar registrado para hacer una pregunta',
                    status: 'warning',
                    isClosable: true,
                    position: 'top-right',
                });
            }
            return;
        }

        requestQuotation({ variables: { ...formData, clientId: user.id, makerId, is_custom_product: true, has_file: file != undefined } });
        try {
            const emailBody = {
                to: user.email,
                from: IMPREDEA_EMAIL,
                subject: `Te han solicitado una cotizacion!`,
                message: `Un cliente te ha pedido una cotizacion. Recuerda responderle cuanto antes.`,
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
        if (mutationResultData) {
            createConversation({ variables: { quotationId: mutationResultData.insert_quotations_one.id } });
            if (file) {
                uploadFile(file.target.files![0], `customQuotation/${mutationResultData.insert_quotations_one.id}`)
            }
        }
        setFile(undefined)
    }, [mutationResultData, createConversation]);

    return (
        <Authorization>
            <Modal isOpen={true} onClose={handleOnClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Solicitud de cotizacion</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalBody>
                            <Flex w="100%">
                                <Stack w="40%" mr="5%">
                                    <FormControl isInvalid={errors.quantity != undefined}>
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
                                    <FormControl isInvalid={errors.qualityId != undefined}>
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
                                    <FormControl isInvalid={errors.materialId != undefined}>
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
                                    <FormControl isInvalid={errors.file_url != undefined}>
                                        <Tooltip hasArrow label="el modelo que quieres cotizar" placement='top-start'>
                                            <FormLabel color="brandBlue" htmlFor="file_url">
                                                Link para acceder al modelo
                                            </FormLabel>
                                        </Tooltip>
                                        <Input
                                            bg="white"
                                            color="black"
                                            id="file_url"
                                            {...register('file_url')}
                                            placeholder='https://free3d.com/'
                                        />
                                        <FormErrorMessage>{errors.file_url && errors.file_url.message}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color="brandBlue" htmlFor="logo">
                                            Archivo del modelo:
                                        </FormLabel>
                                        <input onChange={setFile} type="file" />
                                    </FormControl>
                                    <FormControl isInvalid={errors.clientInstructions != undefined}>
                                        <FormLabel color="brandBlue" htmlFor="clientInstructions">
                                            Informacion para el Maker:
                                        </FormLabel>
                                        <Textarea
                                            bg="white"
                                            color="black"
                                            id="clientInstructions"
                                            placeholder="Por favor ingresa los detalles que creas importantes para tener un producto acorde a tus necesidades. Color, dimensiones, etc"
                                            {...register('clientInstructions', {
                                                required: 'Este campo es requerido',
                                            })}
                                            rows={5}
                                        />
                                        <FormErrorMessage>
                                            {errors.clientInstructions && errors.clientInstructions.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </Stack>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="facebook" type="submit">
                                Pedir Cotizacion
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </Authorization>
    );
};

export default Product;
