import Head from 'next/head';
import Image from 'next/image'
import {
  Flex, Container, Text, Box, Stack, FormControl, FormLabel, Input, Textarea, Button, FormErrorMessage, Heading
} from '@chakra-ui/react';
import { Layout, Authorization } from '@/components/common';
import { useForm } from 'react-hook-form';
import { sendEmail } from '@/utils/miscellaneous';
import { IMPREDEA_EMAIL } from '@/utils/constants';

interface Form {
  name: string;
  email: string;
  motive: string;
  message: string;
}

export default function Home({ }) {

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit = (formData: Form) => {
    sendEmail({ to: IMPREDEA_EMAIL, from: IMPREDEA_EMAIL, subject: formData.motive, message: formData.message })
  }
  return (
    <Authorization>
      <Layout>
        <Head>
          <title>Impredea</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Flex bg="white" h="100vh" mt="10%">
          <Stack ml="35%">
            <Container border="1px" h="150px" borderRadius={"20px"} borderColor={"gray.300"} mb="30px">
              <Flex>
                <Box mr="15px" mt="25px">
                  <a target="_blank" href="https://store.che3d.com.ar/" rel="noopener noreferrer">
                    <Image src="/che3d.png" width={"400"} height={"250"}></Image>
                  </a>
                </Box>
                <Text fontSize={"md"} mt="25px">
                  Tenemos todos los insumos que necesites para hacer funcionar tu negocio. Desde filamento, hasta equipos de impresion. No dudes en contactarnos para empezar tu negocio!
                </Text>
              </Flex>
            </Container>
            <Container border="1px" h="150px" borderRadius={"20px"} centerContent borderColor={"gray.300"}>
              <Text fontSize={"xl"} mt="30px">
                Tu empresa facilita insumos de impresion? Contactanos para ser partners y alcanzar un mayor numero de ventas!
              </Text>
            </Container>
            <Container border="1px" h="auto" borderRadius={"20px"} borderColor={"gray.300"} pt="10px" pb="10px">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl id='email' isInvalid={errors.email != undefined}>
                  <FormLabel>Correo electronico</FormLabel>
                  <Input type='email'
                    {...register('email', {
                      required: 'Este campo es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "correo invalido"
                      }
                    })} />
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>
                <FormControl id='email' isInvalid={errors.name != undefined}>
                  <FormLabel>Nombre de tu empresa</FormLabel>
                  <Input
                    {...register('name', {
                      required: 'Este campo es requerido',
                    })} />
                  <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                </FormControl>
                <FormControl id='email' isInvalid={errors.motive != undefined}>
                  <FormLabel>Motivo del contacto</FormLabel>
                  <Input
                    {...register('motive', {
                      required: 'Este campo es requerido',
                    })} />
                  <FormErrorMessage>{errors.motive && errors.motive.message}</FormErrorMessage>
                </FormControl>
                <FormControl id='email' isInvalid={errors.message != undefined}>
                  <FormLabel>Mensaje</FormLabel>
                  <Textarea
                    {...register('message', {
                      required: 'Este campo es requerido',
                    })} />
                  <FormErrorMessage>{errors.message && errors.message.message}</FormErrorMessage>
                </FormControl>
                <Button colorScheme={"facebook"} type="submit">Enviar mensaje</Button>
              </form>
            </Container>
          </Stack>
        </Flex>
      </Layout>
    </Authorization>
  );
}