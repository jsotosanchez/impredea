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
import client from '@/graphql/apollo-client';
import { Layout, Authorization } from '@/components/common';
import { GET_SEARCHFORM_QUERY } from '@/graphql/queries';
import { removeEmptyFields } from '@/utils/miscellaneous';

interface Province {
  id: number;
  name: string;
}
interface Option {
  id: number;
  label: string;
}

interface SearchProductProps {
  quantities: Option[];
  categories: Option[];
}

interface SearchProductValues {
  productName: string;
  category: number | null;
  quantity: number;
}

const SearchProductForm = ({ quantities, categories }: SearchProductProps) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SearchProductValues>({ defaultValues: { productName: '', category: null } });

  const onSubmit = (formData: SearchProductValues) => {
    const query = removeEmptyFields(formData);
    router.push({ pathname: '/searchProduct', query });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing="10%">
        <FormControl w="40%" ml="5%" isInvalid={errors.productName != undefined}>
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
        <FormControl w="40%" isInvalid={errors.quantity != undefined}>
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
        <FormControl ml="5%" w="40%" isInvalid={errors.category != undefined}>
          <FormLabel color="brandBlue">Categoria:</FormLabel>
          <Select bg="white" color="black" defaultValue={''} id="category" {...register('category')}>
            <option value={''}>Todos</option>
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

interface SearchMakerProps {
  categories: Option[];
  provinces: Province[];
  quantities: Option[];
}

interface SearchMakerValues {
  makerName: string;
  category: number | null;
  quantity: number;
  makerLocation: number | null;
}

const SearchMakerForm = ({ categories, provinces, quantities }: SearchMakerProps) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SearchMakerValues>({ defaultValues: { makerName: '', category: null, makerLocation: null } });

  const onSubmit = (formData: SearchMakerValues) => {
    const query = removeEmptyFields(formData);
    router.push({ pathname: '/searchMaker', query });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing="10%">
        <FormControl w="40%" ml="5%" isInvalid={errors.makerName != undefined}>
          <FormLabel color="brandBlue" htmlFor="makerName">
            Nombre (Opcional):
          </FormLabel>
          <Input bg="white" color="black" id="makerName" {...register('makerName', {})} />
          <FormErrorMessage>{errors.makerName && errors.makerName.message}</FormErrorMessage>
        </FormControl>
        <FormControl ml="5%" w="40%" isInvalid={errors.makerLocation != undefined}>
          <FormLabel color="brandBlue">Localidad:</FormLabel>
          <Select bg="white" color="black" id="makerLocation" {...register('makerLocation')}>
            <option value={''}>Todos</option>
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
        <FormControl ml="5%" w="40%" isInvalid={errors.category != undefined}>
          <FormLabel color="brandBlue">Categoria:</FormLabel>
          <Select bg="white" color="black" id="category" {...register('category')}>
            <option value={''}>Todos</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
        </FormControl>
        <FormControl w="40%" isInvalid={errors.quantity != undefined}>
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

interface Props {
  categories: Option[];
  provinces: Province[];
  quantities: Option[];
}

export default function Home({ quantities, categories, provinces }: Props) {
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
