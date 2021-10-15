import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  Stack,
  Textarea,
  HStack,
  Box,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { ErrorPage, LoadingPage } from '@/components/common';
import { useGetMakerAdmin } from '@/graphql/hooks';
import { useMutation } from '@apollo/client';
import { UPDATE_MAKER_INFO } from '@/graphql/mutations';
import { Layout } from '@/components/mybusiness';
import { MY_BUSINESS_SECTIONS } from '@/utils/constants';
import { BUCKET_FILES_URL } from '@/utils/constants';
import { uploadPhoto } from '@/utils/miscellaneous';

const Profile = ({}) => {
  const router = useRouter();
  const [picture, setPicture] = useState(null);
  const { id } = router.query;
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

  const onSubmit = async (formData) => {
    const { error } = await uploadPhoto(picture, `maker/${id}`);
    if (error) {
      toast({
        title: 'Ha ocurrido un error',
        description: 'Por favor intenta mas tarde',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const pictureKey = picture ? `maker/${id}` : null;
    updateInfo({
      variables: { id, pictureKey, ...formData },
    });
  };

  if (error) return <ErrorPage route={`/`} />;

  if (loading)
    return (
      <Layout activeHeader={MY_BUSINESS_SECTIONS.INFO}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MY_BUSINESS_SECTIONS.INFO}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex>
          <Stack w="40%">
            <HStack spacing="24px">
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
            </HStack>
            <FormLabel color="brandBlue" htmlFor="logo">
              Logo:
            </FormLabel>
            <Box mb="30px">
              <input type="file" onChange={setPicture}></input>
            </Box>
            <Image
              src={
                data.user?.maker_picture_key
                  ? `${BUCKET_FILES_URL}${data.user?.maker_picture_key}`
                  : '/empty-avatar.webp'
              }
              width="300px"
              height="300px"
              alt="error en la imagen"
            />
          </Stack>
          <Spacer />
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
            <Flex direction="row-reverse">
              <Button w="30%" colorScheme="facebook" variant="solid" type="submit" isLoading={loadingUpdateInfo}>
                Guardar
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </form>
    </Layout>
  );
};

export default Profile;
