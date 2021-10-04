import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { LoadingPage } from '../../components/common';
import { useForm } from 'react-hook-form';
import { useGetMakerAdmin } from '../../graphql/hooks';
import { useMutation } from '@apollo/client';
import { UPDATE_MAKER_INFO } from '../../graphql/mutations';

const MakerInfoAdmin = ({ id }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const toast = useToast();
  const { loading, error, data } = useGetMakerAdmin(id);

  const [updateInfo, { loadingUpdateInfo }] = useMutation(UPDATE_MAKER_INFO, {
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

  const onSubmit = (formData) => {
    updateInfo({
      variables: { id, ...formData },
    });
  };

  if (loading) return <LoadingPage />;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex>
        <Stack w="40%">
          <FormControl isInvalid={errors.name}>
            <FormLabel color="brandBlue" htmlFor="name">
              Nombre:
            </FormLabel>
            <Input
              id="name"
              placeholder="Impresiones 3D"
              defaultValue={data.user?.maker_name}
              {...register('name', {
                required: 'Este campo es requerido',
              })}
            />
            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.description}>
            <FormLabel color="brandBlue" htmlFor="description">
              Descripcion de mi empresa:
            </FormLabel>
            <Textarea
              id="description"
              defaultValue={data.user?.maker_description}
              placeholder="Imprimiendo desde..."
              {...register('description', {
                required: 'Este campo es requerido',
              })}
              rows="10"
            />
            <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
          </FormControl>
          <FormLabel color="brandBlue" htmlFor="logo">
            Logo:
          </FormLabel>
          <input type="file"></input>
        </Stack>
        <Spacer />
        <Stack w="40%">
          <FormControl>
            <FormLabel color="brandBlue" htmlFor="rating">
              Rating:
            </FormLabel>
            <Input readOnly id="rating" bg="gray.100" value={data.user?.maker_rating} />
          </FormControl>
          <FormControl>
            <FormLabel color="brandBlue" htmlFor="Sales">
              Ventas Realizadas:
            </FormLabel>
            <Input readOnly id="Sales" bg="gray.100" value={data.user?.maker_sales} />
          </FormControl>
          <Flex direction="row-reverse">
            <Button
              w="30%"
              colorScheme="facebook"
              variant="solid"
              mt="230px"
              type="submit"
              isLoading={loadingUpdateInfo}
            >
              Guardar
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </form>
  );
};

export default MakerInfoAdmin;
