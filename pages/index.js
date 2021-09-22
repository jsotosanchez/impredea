import Head from 'next/head';
import { useRouter } from 'next/router';
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import client from '../graphql/apollo-client';
import { Layout, Authorization } from '../components';
import { GET_SEARCHFORM_QUERY } from '../graphql/queries';
import { removeEmptyFields } from '../utils/methods';

const SearchProductForm = ({ quantities, categories }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { productName: '', category: null } });

  const onSubmit = (formData) => {
    const query = removeEmptyFields(formData);
    router.push({ pathname: '/searchProduct', query });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing="10%">
        <FormControl w="40%" ml="5%" isInvalid={errors.productName}>
          <FormLabel color="brandBlue" htmlFor="productName">
            Que buscas?
          </FormLabel>
          <Input
            bg="white"
            color="black"
            id="productName"
            {...register('productName', {
              required: 'Este campo es requerido',
            })}
          />
          <FormErrorMessage>{errors.productName && errors.productName.message}</FormErrorMessage>
        </FormControl>
        <FormControl w="40%" isInvalid={errors.quantity}>
          <FormLabel color="brandBlue">Cantidad:</FormLabel>
          <Select bg="white" color="black" defaultValue="1" id="quantity" {...register('quantity')}>
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
          <FormLabel color="brandBlue">Categoria:</FormLabel>
          <Select bg="white" color="black" defaultValue={''} id="category" {...register('category')}>
            <option value={''}>Cualquiera</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.category && errors.category.message}</FormErrorMessage>
        </FormControl>
      </Stack>
      <Box ml="38px">
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
    </form>
  );
};

const SearchMakerForm = ({ categories, provinces, quantities }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { makerName: '', category: null, makerLocation: null } });

  const onSubmit = (formData) => {
    const query = removeEmptyFields(formData);
    router.push({ pathname: '/searchMaker', query });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing="10%">
        <FormControl w="40%" ml="38px" isInvalid={errors.makerName}>
          <FormLabel color="brandBlue" htmlFor="makerName">
            Nombre (Opcional):
          </FormLabel>
          <Input bg="white" color="black" id="makerName" {...register('makerName', {})} />
          <FormErrorMessage>{errors.makerName && errors.makerName.message}</FormErrorMessage>
        </FormControl>
        <FormControl ml="5%" w="40%" isInvalid={errors.makerLocation}>
          <FormLabel color="brandBlue">Localidad:</FormLabel>
          <Select bg="white" color="black" defaultValue={''} id="makerLocation" {...register('makerLocation')}>
            <option value={''}>Cualquiera</option>
            {provinces.map((province) => (
              <option value={province.id} key={province.id}>
                {province.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.makerLocation && errors.makerLocation.message}</FormErrorMessage>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing="10%" mt="25px" pb="20px">
        <FormControl ml="5%" w="40%" isInvalid={errors.category}>
          <FormLabel color="brandBlue">Categoria:</FormLabel>
          <Select bg="white" color="black" defaultValue={''} id="category" {...register('category')}>
            <option value={''}>Cualquiera</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
        </FormControl>
        <FormControl w="40%" isInvalid={errors.quantity}>
          <FormLabel color="brandBlue">Cantidad:</FormLabel>
          <Select bg="white" color="black" defaultValue="1" id="quantity" {...register('quantity')}>
            {quantities.map((option) => (
              <option value={option.id} key={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
        </FormControl>
      </Stack>
      <Box ml="38px">
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
    </form>
  );
};

export default function Home({ quantities, categories, provinces }) {
  return (
    <Authorization>
      <Layout>
        <Head>
          <title>Impredea</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Flex bg="white" h="100vh">
          <Center w="50%" ml="auto" mr="auto">
            <Stack>
              <Heading color="brandBlue" size="3xl">
                Convertí tus <br />
                ideas en realidad
              </Heading>
              <Text color="brandLightBlue" fontWeight="semibold">
                Todo lo que buscas en un solo lugar
              </Text>
            </Stack>
          </Center>
          <Center w="50%">
            <Box bg="brandGray.100" h="auto" w="80%" borderRadius="15px">
              <Heading color="brandBlue" size="md" p="15px" pl="38px">
                Qué quieres buscar?
              </Heading>
              <Tabs isFitted variant="line" defaultIndex={1}>
                <TabList mb="1em">
                  <Tab>Productos</Tab>
                  <Tab>Makers</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <SearchProductForm quantities={quantities} categories={categories} />
                  </TabPanel>
                  <TabPanel>
                    <SearchMakerForm categories={categories} provinces={provinces} quantities={quantities} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Center>
        </Flex>
      </Layout>
    </Authorization>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: GET_SEARCHFORM_QUERY,
  });

  return {
    props: {
      quantities: data.order_quantity,
      categories: data.maker_category,
      provinces: data.provinces,
    },
  };
}
