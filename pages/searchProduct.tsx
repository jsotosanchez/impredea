import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  FormErrorMessage,
  UnorderedList,
  Center,
  Heading,
} from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import client from '@/graphql/apollo-client';
import { GET_PRODUCTS, GET_SEARCH_PRODUCT_DATA } from '@/graphql/queries';
import { SideBarLayout, ProductSearchCard, ErrorPage, Layout, LoadingPage } from '@/components/common';
import { formatToContains } from '@/graphql/utils';
import { removeEmptyFields } from '@/utils/miscellaneous';

interface Maker {
  maker_name: string;
  id: number;
}

interface Product {
  id: number;
  main_photo: string;
  description: string;
  maker: Maker;
  name: string;
}

interface SelectOption {
  id: number;
  label: string;
}

interface Props {
  quantities: SelectOption[];
  categories: SelectOption[];
}

interface FormValues {
  productName: string;
  category: string;
  quantity: string;
}

const EmptyResults = () => (
  <Center mt="20%">
    <Heading> Tu busqueda no tuvo ningun resultado!</Heading>
  </Center>
);

const Search = ({ quantities, categories }: Props) => {
  const router = useRouter();
  const { productName, quantity, category } = router.query;
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { category, productName: formatToContains(productName as string), quantity },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues: getFormValues,
  } = useForm({ defaultValues: { productName, category: null, quantity } });

  const onSubmit = ({ productName, ...rest }: FormValues) => {
    refetch({ productName: formatToContains(productName), ...rest });
  };

  const handleLoadMore = () => {
    const { productName, ...rest } = removeEmptyFields(getFormValues());
    fetchMore({
      variables: { productName: `%${productName}%`, ...rest, offset: data.product.length },
    });
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <Layout>
      <SideBarLayout
        sideBarChildren={
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.productName} pb="5px">
              <FormLabel color="brandBlue" htmlFor="productName">
                Que buscas?
              </FormLabel>
              <Input
                bg="white"
                color="black"
                id="productName"
                defaultValue={productName}
                {...register('productName', {
                  required: 'Este campo es requerido',
                })}
              />
              <FormErrorMessage>{errors.productName && errors.productName.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.quantity}>
              <FormLabel color="brandBlue">Que Cantidad?</FormLabel>
              <Select
                bg="white"
                color="black"
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
            <FormControl isInvalid={errors.category}>
              <FormLabel color="brandBlue">Selecciona una categoria</FormLabel>
              <Select bg="white" color="black" id="category" {...register('category')} defaultValue={category}>
                <option value={''}>Todos</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.label}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
            </FormControl>
            <Box pt="27px">
              <Button variant="solid" bg="brandBlue" colorScheme="brandBlue" color="white" type="submit">
                Buscar
              </Button>
            </Box>
          </form>
        }
        contentChildren={
          data.product.length ? (
            <>
              <UnorderedList m="3rem">
                {data.product.map(
                  ({ id, main_photo, description, maker: { maker_name, id: makerId }, name }: Product) => (
                    // <Link  href={`} passHref>
                    <ProductSearchCard
                      key={id}
                      main_photo={main_photo}
                      description={description}
                      makerName={maker_name}
                      productName={name}
                      handleOnClick={() => router.push(`/maker/${makerId}/product/${id}`)}
                    />
                    // </Link>
                  )
                )}
              </UnorderedList>
              <Box>
                <Button variant="solid" colorScheme="facebook" ml="75%" onClick={handleLoadMore} isLoading={loading}>
                  Cargar mas
                </Button>
              </Box>
            </>
          ) : (
            <EmptyResults />
          )
        }
      />
    </Layout>
  );
};

export default Search;

export async function getServerSideProps() {
  const { data } = await client.query({
    query: GET_SEARCH_PRODUCT_DATA,
  });

  return {
    props: {
      quantities: data.order_quantity,
      categories: data.maker_category,
    },
  };
}
