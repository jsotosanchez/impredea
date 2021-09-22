import { useRouter } from 'next/router';
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
import { useForm } from 'react-hook-form';
import { ErrorPage, Layout, LoadingPage } from '../components';
import client from '../graphql/apollo-client';
import { GET_PRODUCTS, GET_SEARCH_PRODUCT_DATA } from '../graphql/queries';
import ProductSearchCard from '../components/ProductSearchCard';
import SideBarLayout from '../components/SideBarLayout';
import { useQuery } from '@apollo/client';

const EmptyResults = () => (
  <Center mt="20%">
    <Heading> Tu busqueda no tuvo ningun resultado!</Heading>
  </Center>
);

const Search = ({ quantities, categories }) => {
  const router = useRouter();
  const { productName, quantity, category } = router.query;
  const productNameForQuery = `%${productName}%`;
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { category, productName: productNameForQuery, quantity },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues: getFormValues,
  } = useForm();

  const onSubmit = ({ productName, ...rest }) => {
    refetch({ productName: `%${productName}%`, ...rest });
  };

  const handleOnClick = (id) => {
    router.push({ pathname: `/maker/${id}` });
  };

  const handleLoadMore = () => {
    const { makerName, ...rest } = removeEmptyFields(getFormValues());
    fetchMore({
      variables: { makerName: `%${makerName}%`, ...rest, offset: data.user.length },
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
                defaultValue={quantity}
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
              <Select bg="white" color="black" defaultValue={category} id="category" {...register('category')}>
                <option value={null}>Cualquiera</option>
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
                {data.product.map(({ id, main_photo, description, maker: { maker_name }, name }) => (
                  <ProductSearchCard
                    id={id}
                    main_photo={main_photo}
                    description={description}
                    makerName={maker_name}
                    productName={name}
                    handleOnClick={() => handleOnClick(id)}
                    key={id}
                  />
                ))}
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
