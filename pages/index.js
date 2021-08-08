import Head from 'next/head';
import {
  Box,
  Center,
  Flex,
  Heading,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import client from '../apollo-client';
import { useForm } from 'react-hook-form';

const SearchForm = ({ quantities, categories }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (formData) => {
    router.push({ pathname: '/search', query: formData });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing="10%" mt="10px">
        <FormControl w="40%" ml="5%" isInvalid={errors.search}>
          <FormLabel color="brandBlue" htmlFor="search">
            Que buscas?
          </FormLabel>
          <Input
            bg="white"
            color="black"
            id="search"
            {...register('search', {
              required: 'Este campo es requerido',
            })}
          />
          <FormErrorMessage>{errors.search && errors.search.message}</FormErrorMessage>
        </FormControl>
        <FormControl w="40%" isInvalid={errors.quantity}>
          <FormLabel color="brandBlue">Que Cantidad?</FormLabel>
          <Select
            bg="white"
            color="black"
            defaultValue="1"
            id="quantity"
            {...register('quantity', {
              required: 'Este campo es requerido',
            })}
          >
            {quantities.map((option) => (
              <option value={option.id} key={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing="10%" mt="25px" pb="20px">
        <FormControl ml="5%" w="40%" isInvalid={errors.category}>
          <FormLabel color="brandBlue">Selecciona una categoria</FormLabel>
          <Select
            bg="white"
            color="black"
            defaultValue="6"
            id="category"
            {...register('category', {
              required: 'Este campo es requerido',
            })}
          >
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
        </FormControl>
        <Box pt="27px">
          <Button
            variant="solid"
            bg="brandBlue"
            colorScheme="brandBlue"
            color="white"
            type="submit"
            isLoading={isSubmitting}
          >
            Buscar
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default function Home({ quantities, categories }) {
  return (
    <Layout>
      <Head>
        <title>Impredea</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex bg="white" h="100vh">
        <Center w="50%" ml="auto" mr="auto">
          <Stack>
            <Heading color="brandBlue" size="3xl">
              Converti tus <br />
              ideas en realidad
            </Heading>
            <Text color="brandLightBlue" fontWeight="semibold">
              Todo lo que buscas en un solo lugar
            </Text>
          </Stack>
        </Center>
        <Center w="50%">
          <Box bg="brandGray.100" h="auto" w="80%" borderRadius="30px">
            <SearchForm quantities={quantities} categories={categories}></SearchForm>
          </Box>
        </Center>
      </Flex>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: gql`
      query MyQuery {
        order_quantity {
          id
          label
        }
        maker_category {
          id
          label
        }
      }
    `,
  });

  return {
    props: {
      quantities: data.order_quantity,
      categories: data.maker_category,
    },
  };
}
