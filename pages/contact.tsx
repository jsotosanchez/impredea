import Head from 'next/head';
import {
  Flex, Container, Stack, FormControl, FormLabel, Input, Textarea, Button, FormErrorMessage, Heading
} from '@chakra-ui/react';
import { Layout, Authorization } from '@/components/common';
import { useForm } from 'react-hook-form';
import { sendEmail } from '@/utils/miscellaneous';
import { IMPREDEA_EMAIL, } from '@/utils/constants';

interface Form {
  email: string;
  motive: string;
  message: string;
}

export default function Contact({ }) {

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
          <Stack w="100%" ml="35%">
            <Heading as="h2" size={"xl"} color="brandBlue">
              Contactanos!
            </Heading>
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
                <FormControl id='motive' isInvalid={errors.motive != undefined}>
                  <FormLabel>Motivo del contacto</FormLabel>
                  <Input
                    {...register('motive', {
                      required: 'Este campo es requerido',
                    })} />
                  <FormErrorMessage>{errors.motive && errors.motive.message}</FormErrorMessage>
                </FormControl>
                <FormControl id='message' isInvalid={errors.message != undefined}>
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
    </Authorization >
  );
}