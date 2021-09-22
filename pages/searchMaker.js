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
  // Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  UnorderedList,
} from '@chakra-ui/react';
// import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { gql, useQuery } from '@apollo/client';
import { Layout, LoadingPage, MakerCard, ErrorPage } from '../components/';
import client from '../graphql/apollo-client';
// import { GRAPHQL_SORT_ENUMS } from '../utils/constants';
import { GET_MAKERS } from '../graphql/queries';

const Search = ({ quantities, categories, provinces }) => {
  const router = useRouter();
  const { makerName, quantity, category, location } = router.query;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [minRep, setMinRep] = useState(3);
  // const [priceOrder, setPriceOrder] = useState(GRAPHQL_SORT_ENUMS.ASC);
  // const [ratingOrder, setRatingOrder] = useState(GRAPHQL_SORT_ENUMS.DESC);

  const { data, loading, error, refetch } = useQuery(GET_MAKERS, {
    variables: { category, makerName: `%${makerName}%`, quantity, location },
  });

  const onSubmit = (formData) => {
    console.log({ ...formData, minRep });
  };

  const handleOnClick = (id) => {
    router.push({ pathname: `/maker/${id}` });
  };

  // const handlePriceOrder = (order) => setPriceOrder(order);

  // const handleRatingOrder = (order) => setRatingOrder(order);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;
  return (
    <Layout>
      <Flex w="100%" h="100vh" pt="4rem">
        <Stack w="25%" bg="brandGray.100" v="100vh" p="2rem 3rem">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.makerName} pb="5px">
              <FormLabel color="brandBlue" htmlFor="makerName">
                Nombre del Maker:
              </FormLabel>
              <Input
                bg="white"
                color="black"
                id="makerName"
                defaultValue={makerName}
                {...register('makerName', {
                  required: 'Este campo es requerido',
                })}
              />
              <FormErrorMessage>{errors.makerName && errors.makerName.message}</FormErrorMessage>
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
              <Select
                bg="white"
                color="black"
                defaultValue={category}
                id="category"
                {...register('category', {
                  required: 'Este campo es requerido',
                })}
              >
                <option value={null}>Cualquiera</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.label}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.makerLocation}>
              <FormLabel color="brandBlue">Selecciona una localidad:</FormLabel>
              <Select bg="white" color="black" defaultValue={null} id="makerLocation" {...register('makerLocation')}>
                <option value={null}>Cualquiera</option>
                {provinces.map((province) => (
                  <option value={province.id} key={province.id}>
                    {province.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.makerLocation && errors.makerLocation.message}</FormErrorMessage>
            </FormControl>
            <Divider colorScheme="white" color="white" />
            {/* <Text color="brandBlue" fontWeight="bold" fontSize="xl">
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
            </Flex> */}
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
        </Stack>
        <Stack w="75%" bg="white" h="100%" overflow="scroll">
          <UnorderedList m="3rem">
            {data.user.map(({ maker_name, maker_description, maker_rating, id }) => (
              <MakerCard
                name={maker_name}
                description={maker_description}
                rating={maker_rating}
                handleOnClick={() => handleOnClick(id)}
                key={id}
              />
            ))}
          </UnorderedList>
        </Stack>
      </Flex>
    </Layout>
  );
};

export default Search;

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
        provinces {
          name
          id
        }
      }
    `,
  });

  return {
    props: {
      quantities: data.order_quantity,
      categories: data.maker_category,
      provinces: data.provinces,
    },
  };
}
