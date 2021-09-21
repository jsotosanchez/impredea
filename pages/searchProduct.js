import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Divider,
  FormErrorMessage,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  UnorderedList,
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import client from '../graphql/apollo-client';
import { GRAPHQL_SORT_ENUMS } from '../utils/constants';
import { GET_PRODUCTS } from '../graphql/queries';
import ProductSearchCard from '../components/ProductSearchCard';
import SideBarLayout from '../components/SideBarLayout';

const Search = ({ quantities, categories, products }) => {
  console.log(products);
  const router = useRouter();
  const { productName, quantity, category } = router.query;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [minRep, setMinRep] = useState(3);
  const [priceOrder, setPriceOrder] = useState(GRAPHQL_SORT_ENUMS.ASC);
  const [ratingOrder, setRatingOrder] = useState(GRAPHQL_SORT_ENUMS.DESC);

  const onSubmit = (formData) => {
    console.log({ ...formData, minRep });
  };

  const handleOnClick = (id) => {
    router.push({ pathname: `/maker/${id}` });
  };

  const handlePriceOrder = (order) => setPriceOrder(order);

  const handleRatingOrder = (order) => setRatingOrder(order);

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
              <Select bg="white" color="black" defaultValue={quantity} id="quantity" {...register('quantity')}>
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
            <Divider colorScheme="white" color="white" />
            <Text color="brandBlue" fontWeight="bold" fontSize="xl">
              Ordenar por:
            </Text>
            <Flex>
              <FormLabel color="brandBlue">Precio</FormLabel>
              <ArrowDownIcon
                color={priceOrder === GRAPHQL_SORT_ENUMS.DESC ? 'brandBlue' : 'gray'}
                onClick={() => handlePriceOrder(GRAPHQL_SORT_ENUMS.DESC)}
              />
              <ArrowUpIcon
                color={priceOrder === GRAPHQL_SORT_ENUMS.ASC ? 'brandBlue' : 'gray'}
                onClick={() => handlePriceOrder(GRAPHQL_SORT_ENUMS.ASC)}
              />
            </Flex>
            <Flex>
              <FormLabel color="brandBlue">Reputacion</FormLabel>
              <ArrowDownIcon
                color={ratingOrder === GRAPHQL_SORT_ENUMS.DESC ? 'brandBlue' : 'gray'}
                onClick={() => handleRatingOrder(GRAPHQL_SORT_ENUMS.DESC)}
              />
              <ArrowUpIcon
                color={ratingOrder === GRAPHQL_SORT_ENUMS.ASC ? 'brandBlue' : 'gray'}
                onClick={() => handleRatingOrder(GRAPHQL_SORT_ENUMS.ASC)}
              />
            </Flex>
            <FormLabel color="brandBlue">Reputacion minima: {minRep}</FormLabel>
            <Slider
              min={1}
              max={5}
              aria-label="slider-ex-1"
              defaultValue={minRep}
              name="reputacion"
              onChange={(v) => setMinRep(v)}
            >
              <SliderTrack bg="white">
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Box pt="27px">
              <Button variant="solid" bg="brandBlue" colorScheme="brandBlue" color="white" type="submit">
                Buscar
              </Button>
            </Box>
          </form>
        }
        contentChildren={
          <UnorderedList m="3rem">
            {products.map(({ id, main_photo, description, maker: { fullname }, name }) => (
              <ProductSearchCard
                id={id}
                main_photo={main_photo}
                description={description}
                makerName={fullname}
                productName={name}
                handleOnClick={() => handleOnClick(id)}
                key={id}
              />
            ))}
          </UnorderedList>
        }
      />
    </Layout>
  );
};

export default Search;

export async function getServerSideProps({ query }) {
  const { productName, quantity, category } = query;
  const productNameForQuery = `%${productName}%`;

  const { data } = await client.query({
    query: GET_PRODUCTS,
    variables: { category, productName: productNameForQuery },
  });

  return {
    props: {
      quantities: data.order_quantity,
      categories: data.maker_category,
      products: data.product,
    },
  };
}
