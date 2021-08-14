import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import { useGetUser } from '../../graphql/hooks';

const MyProfile = () => {
  const router = useRouter();

  const { id } = router.query;

  const { data, loading } = useGetUser(id);

  console.log(data);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    console.log(formData);
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
            <Heading as="h1" size="lg" color="brandBlue">
              Mis datos
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <FormControl isInvalid={errors.fullName}>
                  <FormLabel color="brandBlue" htmlFor="fullName">
                    Nombre y apellido:
                  </FormLabel>
                  <Input
                    bg="white"
                    color="black"
                    id="fullName"
                    defaultValue={data.user.name}
                    {...register('fullName', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.fullName && errors.fullName.message}</FormErrorMessage>
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
                <FormControl isInvalid={errors.zipCode}>
                  <FormLabel color="brandBlue" htmlFor="zipCode">
                    Codigo Postal:
                  </FormLabel>
                  <Input
                    bg="white"
                    color="black"
                    id="zipCode"
                    defaultValue={data.user.zip_code}
                    {...register('zipCode', {
                      required: 'Este campo es requerido',
                    })}
                  />
                  <FormErrorMessage>{errors.zipCode && errors.zipCode.message}</FormErrorMessage>
                </FormControl>
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
