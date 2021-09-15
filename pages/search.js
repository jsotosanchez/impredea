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
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import client from '../graphql/apollo-client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import MakerCard from '../components/MakerCard';

const Search = ({ quantities, categories, makers }) => {
  const router = useRouter();

  const { search, quantity, category } = router.query;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    console.log(formData);
  };

  const handleOnClick = (id) => {
    router.push({ pathname: `/maker/${id}` });
  };

  const [minRep, setMinRep] = useState(3);

  const handlePriceOrder = () => {};

  return (
    <Layout>
      <Flex w="100%" h="100vh" pt="4rem">
        <Stack w="25%" bg="brandGray.100" v="100vh" p="2rem 3rem">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.search} pb="5px">
              <FormLabel color="brandBlue" htmlFor="search">
                Que buscas?
              </FormLabel>
              <Input
                bg="white"
                color="black"
                id="search"
                defaultValue={search}
                {...register('search', {
                  required: 'Este campo es requerido',
                })}
              />
              <FormErrorMessage>{errors.search && errors.search.message}</FormErrorMessage>
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
            <Divider colorScheme="white" color="white" />
            <Text color="brandBlue" fontWeight="bold" fontSize="xl">
              Ordenar por:
            </Text>
            <Flex>
              <FormLabel color="brandBlue">Precio</FormLabel>
              <ArrowDownIcon color="brandBlue" onClick={handlePriceOrder} />
              <ArrowUpIcon color="brandBlue" onClick={handlePriceOrder} />
            </Flex>
            <Flex>
              <FormLabel color="brandBlue">Ventas</FormLabel>
              <ArrowDownIcon color="brandBlue" onClick={handlePriceOrder} />
              <ArrowUpIcon color="brandBlue" onClick={handlePriceOrder} />
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
        </Stack>
        <Stack w="75%" bg="white" h="100%" overflow="scroll">
          <UnorderedList m="3rem">
            {makers.map(({ maker_name, maker_description, maker_rating, maker_sales, id }) => (
              <MakerCard
                name={maker_name}
                description={maker_description}
                rating={maker_rating}
                sales={maker_sales}
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
        user(where: { maker_active: { _eq: true } }) {
          maker_category_id
          maker_description
          maker_name
          maker_rating
          maker_sales
          id
        }
      }
    `,
  });

  return {
    props: {
      quantities: data.order_quantity,
      categories: data.maker_category,
      makers: data.user,
    },
  };
}
