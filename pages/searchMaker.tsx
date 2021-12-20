import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  FormErrorMessage,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  UnorderedList,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { gql, useQuery } from '@apollo/client';
import { Layout, LoadingPage, MakerCard, ErrorPage, SideBarLayout, EmptyResults, Authorization } from '@/components/common';
import client from '@/graphql/apollo-client';
import { GET_MAKERS } from '@/graphql/queries';
import { formatToContains } from '@/graphql/utils';
import { removeEmptyFields } from '@/utils/miscellaneous';
import { SessionContext } from '@/context/sessionContext';

interface User {
  maker_name: string;
  maker_description: string;
  maker_rating: number;
  id: number;
  maker_picture_key: string;
}

interface FormValues {
  quantity: number;
  makerName: string;
  category: number;
}

interface Props {
  quantities: { id: number; label: string }[];
  categories: { id: number; label: string }[];
  provinces: { id: number; name: string }[];
}

const Search = ({ quantities, categories, provinces }: Props) => {
  const router = useRouter();
  const context = useContext(SessionContext);
  const currentUser = context.getUser();
  const { makerName, quantity, category, location } = router.query;
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues: getFormValues,
  } = useForm({ defaultValues: { makerName: makerName, category: null, makerLocation: null, quantity } });
  const [minRep, setMinRep] = useState(3);

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_MAKERS, {
    variables: { category, makerName: formatToContains(makerName as string), quantity, location, minRep, id: currentUser?.id },
  });
  const onSubmit = (formData: FormValues) => {
    const { makerName, ...rest } = removeEmptyFields(formData);

    refetch({ makerName: `%${makerName}%`, ...rest, minRep });
  };

  const handleOnClick = (id: number) => {
    router.push({ pathname: `/maker/${id}/catalog` });
  };

  const handleLoadMore = () => {
    const { makerName, ...rest } = removeEmptyFields(getFormValues());
    fetchMore({
      variables: { makerName: `%${makerName}%`, ...rest, offset: data.user.length, minRep },
    });
  };
  if (loading) return <LoadingPage />;
  if (error) {
    return <ErrorPage />;
  }
  return (
    <Authorization>
      <Layout>
        <SideBarLayout
          sideBarChildren={
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={errors.makerName != undefined} pb="5px">
                <FormLabel color="brandBlue" htmlFor="makerName">
                  Nombre del Maker:
                </FormLabel>
                <Input bg="white" color="black" id="makerName" defaultValue={makerName} {...register('makerName')} />
                <FormErrorMessage>{errors.makerName && errors.makerName.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.quantity != undefined}>
                <FormLabel color="brandBlue">Que Cantidad?</FormLabel>
                <Select
                  bg="white"
                  color="black"
                  id="quantity"
                  {...register('quantity', {
                    required: 'Este campo es requerido',
                  })}
                >
                  {quantities.map((option: { id: number; label: string }) => (
                    <option value={option.id} key={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.category != undefined}>
                <FormLabel color="brandBlue">Selecciona una categoria</FormLabel>
                <Select bg="white" color="black" defaultValue={category} id="category" {...register('category')}>
                  <option value={''}>Todos</option>
                  {categories.map((category: { id: number; label: string }) => (
                    <option value={category.id} key={category.id}>
                      {category.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.quantity && errors.quantity.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.makerLocation != undefined}>
                <FormLabel color="brandBlue">Selecciona una localidad:</FormLabel>
                <Select
                  bg="white"
                  color="black"
                  defaultValue={location}
                  id="makerLocation"
                  {...register('makerLocation')}
                >
                  <option value={''}>Todos</option>
                  {provinces.map((province: { id: number; name: string }) => (
                    <option value={province.id} key={province.id}>
                      {province.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.makerLocation && errors.makerLocation.message}</FormErrorMessage>
              </FormControl>
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
            data.user.length ? (
              <>
                <UnorderedList m="3rem">
                  {data.user.map(({ maker_name, maker_description, maker_rating, id, maker_picture_key }: User) => (
                    <MakerCard
                      name={maker_name}
                      description={maker_description}
                      rating={maker_rating}
                      handleOnClick={() => handleOnClick(id)}
                      key={id}
                      picKey={maker_picture_key}
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
    </Authorization>
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
