import { useMutation, useQuery } from '@apollo/client';
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
  Stack,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Layout, LoadingPage } from '@/components/common';
import { UPDATE_USER_BY_PK } from '@/graphql/mutations';
import { GET_USER_BY_ID } from '@/graphql/queries';

interface Form {
  fullname: string;
  document: string;
  email: string;
  province: string;
  street: string;
  location: string;
  zip_code: string;
  maker_active: boolean;
}

const MyProfile = (): JSX.Element => {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;

  const { data, loading, refetch } = useQuery(GET_USER_BY_ID, { variables: { id } });

  const [updateUserInfo] = useMutation(UPDATE_USER_BY_PK, {
    onCompleted: () => {
      toast({
        title: 'Se han guardado tus datos.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetch();
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

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit = (formData: Form) => {
    updateUserInfo({
      variables: { id, ...formData },
    });
  };

  return (
    <Layout>
      {loading ? (
        <LoadingPage />
      ) : (
        <Center mt="10%">
          <Box w="700px" bg="gray.100" borderRadius="10px" p="20px">
            <Heading as="h1" size="lg" color="brandBlue" mb="5px">
              Mis datos
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <FormControl isInvalid={errors.fullname != undefined}>
                  <FormLabel color="brandBlue" htmlFor="fullname">
                    Nombre y apellido:
                  </FormLabel>
                  <Input
                    bg="white"
                    color="black"
                    id="fullname"
                    defaultValue={data.user_by_pk.fullname}
                    {...register('fullname', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.fullname && errors.fullname.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.document != undefined}>
                  <FormLabel color="brandBlue" htmlFor="document">
                    Documento:
                  </FormLabel>
                  <Input
                    bg="white"
                    color="black"
                    id="document"
                    defaultValue={data.user_by_pk.document}
                    type="number"
                    {...register('document', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.document && errors.document.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.email != undefined}>
                  <FormLabel color="brandBlue" htmlFor="email">
                    Email:
                  </FormLabel>
                  <Input
                    bg="white"
                    color="black"
                    id="email"
                    defaultValue={data.user_by_pk.email}
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
                    <FormControl isInvalid={errors.province != undefined}>
                      <FormLabel color="brandBlue" htmlFor="province">
                        Provincia:
                      </FormLabel>
                      <Input
                        bg="white"
                        color="black"
                        id="province"
                        defaultValue={data.user_by_pk.province}
                        {...register('province', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.province && errors.province.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.street != undefined}>
                      <FormLabel color="brandBlue" htmlFor="street">
                        Calle y numero:
                      </FormLabel>
                      <Input
                        bg="white"
                        color="black"
                        id="street"
                        placeholder="Lima 752"
                        defaultValue={data.user_by_pk.street}
                        {...register('street', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.street && errors.street.message}</FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Spacer />
                  <Stack w="45%">
                    <FormControl isInvalid={errors.location != undefined}>
                      <FormLabel color="brandBlue" htmlFor="location">
                        Localidad
                      </FormLabel>
                      <Input
                        bg="white"
                        color="black"
                        id="location"
                        defaultValue={data.user_by_pk.location}
                        {...register('location', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.location && errors.location.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.zip_code != undefined}>
                      <FormLabel color="brandBlue" htmlFor="zip_code">
                        Codigo Postal:
                      </FormLabel>
                      <Input
                        bg="white"
                        color="black"
                        id="zip_code"
                        defaultValue={data.user_by_pk.zip_code}
                        {...register('zip_code', {
                          required: 'Este campo es requerido',
                        })}
                      />
                      <FormErrorMessage>{errors.zip_code && errors.zip_code.message}</FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Flex>
                <Checkbox defaultChecked={data.user_by_pk.maker_active} {...register('maker_active')}>
                  Activar mi cuenta como Maker
                </Checkbox>
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
