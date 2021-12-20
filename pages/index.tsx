import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
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
  chakra,
  VisuallyHidden,
  SimpleGrid,
  StackDivider,
  Icon,
  Image,
  useColorModeValue, Container
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ReactNode, ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import client from '@/graphql/apollo-client';
import { Layout, Authorization } from '@/components/common';
import { GET_SEARCHFORM_QUERY } from '@/graphql/queries';
import { removeEmptyFields } from '@/utils/miscellaneous';
import { FcAssistant, FcLock, FcApproval } from 'react-icons/fc';
import {
  IoAnalyticsSharp,
  IoLogoBitcoin,
  IoSearchSharp,
} from 'react-icons/io5';

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
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
          <Flex p={8} flex={1} align={'center'} justify={'center'}>
            <Stack spacing={6} w={'full'} maxW={'lg'}>
              <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                <Text
                  as={'span'}
                  position={'relative'}>
                  Imprime
                </Text>
                <br />{' '}
                <Text color={'brandBlue'} as={'span'}>
                  Tus ideas
                </Text>{' '}
              </Heading>
              <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
                Todo lo que necesitas para imprimir 3D en un solo lugar.
              </Text>
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                <Box
                  bg={useColorModeValue('gray.50', 'gray.900')}
                  color={useColorModeValue('gray.700', 'gray.200')}
                  h="auto" w="100%" borderRadius="15px">
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
              </Stack>
            </Stack>
          </Flex>
          <Flex flex={1}>
            <Image
              alt={'Login Image'}
              objectFit={'cover'}
              src={
                './landing.jpg'
              }
            />
          </Flex>
        </Stack>
        <SimpleThreeColumns />
        <SplitWithImage />
        <SmallWithSocial />
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


const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

function SmallWithSocial() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Text>© 2020 Impredea. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'Twitter'} href={'#'}>
            <FaTwitter />
          </SocialButton>
          <SocialButton label={'Instagram'} href={'#'}>
            <FaInstagram />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}


interface FeatureOneProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
}

const FeatureOne = ({ text, icon, iconBg }: FeatureOneProps) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex
        w={8}
        h={8}
        align={'center'}
        justify={'center'}
        rounded={'full'}
        bg={iconBg}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

function SplitWithImage() {
  return (
    <Container maxW={'5xl'} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Text
            textTransform={'uppercase'}
            color={'blue.400'}
            fontWeight={600}
            fontSize={'sm'}
            bg={useColorModeValue('blue.50', 'blue.900')}
            p={2}
            alignSelf={'flex-start'}
            rounded={'md'}>
            Quiero formar parte!
          </Text>
          <Heading>Alcanza nuevos clientes</Heading>
          <Text color={'gray.500'} fontSize={'lg'}>
            Deja que nosotros nos encarguemos de publicitarte y forma parte de nuestra red de Makers
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.100', 'gray.700')}
              />
            }>
            <FeatureOne
              icon={
                <Icon as={IoAnalyticsSharp} color={'yellow.500'} w={5} h={5} />
              }
              iconBg={useColorModeValue('yellow.100', 'yellow.900')}
              text={'Logra mas ventas'}
            />
            <FeatureOne
              icon={<Icon as={IoLogoBitcoin} color={'green.500'} w={5} h={5} />}
              iconBg={useColorModeValue('green.100', 'green.900')}
              text={'Incrementa tus ingresos'}
            />
            <FeatureOne
              icon={
                <Icon as={IoSearchSharp} color={'blue.500'} w={5} h={5} />
              }
              iconBg={useColorModeValue('blue.100', 'blue.900')}
              text={'Obten mayor visibilidad'}
            />
          </Stack>
        </Stack>
        <Flex>
          <Image
            rounded={'md'}
            alt={'feature image'}
            src={
              './network.jpg'
            }
            objectFit={'cover'}
          />
        </Flex>
      </SimpleGrid>
    </Container>
  );
}


interface FeatureProps {
  title: string;
  text: string;
  icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

function SimpleThreeColumns() {
  return (
    <Box p={4}
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w={"80%"} marginX={"auto"}>
        <Feature
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          title={'Soporte'}
          text={
            'Nunca estaras solo en tu compra, vamos a ayudarte con cualquier incoveniente que pueda surgir.'
          }
        />
        <Feature
          icon={<Icon as={FcLock} w={10} h={10} />}
          title={'Seguridad'}
          text={
            'Tu dinero esta seguro hasta concretar la venta y obtengas tu producto.'
          }
        />
        <Feature
          icon={<Icon as={FcApproval} w={10} h={10} />}
          title={'Calidad'}
          text={
            'En nuestra amplia red de Makers vas a poder conseguir uno que se ajuste a tus necesidades.'
          }
        />
      </SimpleGrid>
    </Box>
  );
}