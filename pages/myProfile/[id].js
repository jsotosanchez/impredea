import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import { useGetUser } from '../../graphql/hooks';
import { UPDATE_USER_BY_PK } from '../../graphql/mutations';

const MyProfile = () => {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;

  const { data, loading } = useGetUser(id);

  const [updateUserInfo, { loadingMutation }] = useMutation(UPDATE_USER_BY_PK, {
    onCompleted: () => {
      toast({
        title: 'Se han guardado tus datos.',
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

  console.log(data);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    updateUserInfo({
      variables: { id, ...formData },
    });
  };
  return (
    <Layout>
      {loading ? (
        <Center h="100%" mt="20%">
          <Spinner />
        </Center>
      ) : (
        <Center mt="10%">
          <Box w="700px" bg="gray.100" borderRadius="10px" p="20px">
            <Heading as="h1" size="lg" color="brandBlue" mb="5px">
              Mis datos
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <FormControl isInvalid={errors.fullname}>
                  <FormLabel color="brandBlue" htmlFor="fullname">
                    Nombre y apellido:
                  </FormLabel>
                  <Input
                    bg="white"
                    color="black"
                    id="fullname"
                    defaultValue={data.user.fullname}
                    {...register('fullname', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.fullname && errors.fullname.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.document}>
                  <FormLabel color="brandBlue" htmlFor="document">
                    Documento:
                  </FormLabel>
                  <Input
                    bg="white"
                    color="black"
                    id="document"
                    defaultValue={data.user.document}
                    type="number"
                    {...register('document', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.document && errors.document.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.email}>
                  <FormLabel color="brandBlue" htmlFor="email">
                    Email:
                  </FormLabel>
                  <Input
                    bg="white"
                    color="black"
                    id="email"
                    defaultValue={data.user.email}
                    {...register('email', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>
                <Heading as="h2" size="md" color="brandBlue" mb="5px">
                  Direccion:
                </Heading>
                <Flex>
                  <Stack w="45%">
                    <FormControl isInvalid={errors.province}>
                      <FormLabel color="brandBlue" htmlFor="province">
                        Provincia:
                      </FormLabel>
                      <Input
                        bg="white"
                        color="black"
                        id="province"
                        defaultValue={data.user.province}
                        {...register('province', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.province && errors.province.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.street}>
                      <FormLabel color="brandBlue" htmlFor="street">
                        Calle y numero:
                      </FormLabel>
                      <Input
                        bg="white"
                        color="black"
                        id="street"
                        placeholder="Lima 752"
                        defaultValue={data.user.street}
                        {...register('street', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.street && errors.street.message}</FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Spacer />
                  <Stack w="45%">
                    <FormControl isInvalid={errors.location}>
                      <FormLabel color="brandBlue" htmlFor="location">
                        Localidad
                      </FormLabel>
                      <Input
                        bg="white"
                        color="black"
                        id="location"
                        defaultValue={data.user.location}
                        {...register('location', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.location && errors.location.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.zip_code}>
                      <FormLabel color="brandBlue" htmlFor="zip_code">
                        Codigo Postal:
                      </FormLabel>
                      <Input
                        bg="white"
                        color="black"
                        id="zip_code"
                        defaultValue={data.user.zip_code}
                        {...register('zip_code', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.zip_code && errors.zip_code.message}</FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Flex>
              </Stack>
              <Button mt="10px" alignSelf="flex-end" type="submit" colorScheme="facebook">
                Guardar
              </Button>
            </form>
          </Box>
        </Center>
      )}
    </Layout>
  );
};

export default MyProfile;
