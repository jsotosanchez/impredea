import { DetailedHTMLProps, InputHTMLAttributes, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Spacer,
  Flex,
  FormLabel,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import _ from 'lodash';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { DELETE_PRODUCT_BY_ID, EDIT_PRODUCT_BY_ID, INSERT_PRODUCT } from '@/graphql/mutations';
import { GET_PRODUCTS_BY_MAKER_ID, GET_PRODUCT_BY_ID } from '@/graphql/queries';
import { formatToStartsWith } from '@/graphql/utils';
import { usePagination } from '@/hooks/index';
import { EmptyResults, ErrorPage, LoadingPage, ManageProductModal, PaginationButtons } from '@/components/common';
import { Layout } from '@/components/mybusiness';
import { MY_BUSINESS_SECTIONS } from '@/utils/constants';
import { ManageProductForm } from '@/types/product';
import { uploadPhoto } from '@/utils/miscellaneous';

const generateFileName = (productId: string) => `products/${productId}`;

interface Product {
  id: number;
  name: string;
  updated_at: string;
}

const Catalog = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const [currentProductId, setCurrentProductId] = useState<number>();
  const [filter, setFilter] = useState('');
  const [picture, setPicture] = useState<DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > | null>(null);
  const {
    data,
    loading: loadingProducts,
    error,
    refetch,
  } = useQuery(GET_PRODUCTS_BY_MAKER_ID, { variables: { id, filter: formatToStartsWith(filter) } });
  const [getProduct, { loading: loadingGetProduct, data: currentProduct }] = useLazyQuery(GET_PRODUCT_BY_ID, {
    variables: { id: currentProductId },
  });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);

  const toast = useToast();
  const { isOpen: addModalIsOpen, onOpen: addModalOnOpen, onClose: addModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalOnOpen, onClose: editModalOnClose } = useDisclosure();
  const {
    handleSubmit: handleAddModalSubmit,
    register: registerAddModal,
    formState: { errors: addModalErrors },
    reset: resetAddModal,
  } = useForm<ManageProductForm>();
  const {
    handleSubmit: handleEditModalSubmit,
    register: registerEditModal,
    formState: { errors: editModalErrors },
    reset: resetEditModal,
  } = useForm<ManageProductForm>();

  const productsHasResults = data ? data.product.length > 0 : false;

  const [insertProduct, { data: insertResult }] = useMutation(INSERT_PRODUCT, {
    onError: () => {
      toast({
        title: 'No se pudo guardar tu producto',
        description: 'Por favor intenta mas tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Estamos guardando tu producto...',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const [editProduct] = useMutation(EDIT_PRODUCT_BY_ID, {
    onError: () => {
      toast({
        title: 'No se pudo guardar tu producto',
        description: 'Por favor intenta mas tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    onCompleted: () => {
      if (picture)
        toast({
          title: 'Estamos guardando tu producto...',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      else {
        toast({
          title: 'Se ha guardado tu producto de forma exitosa!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    },
  });
  const [deleteProduct] = useMutation(DELETE_PRODUCT_BY_ID, {
    onError: () => {
      toast({
        title: 'No se pudo borrar tu producto',
        description: 'Por favor intenta mas tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Tu producto se borro con exito.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetch();
    },
  });

  const debouncedSearch = _.debounce(() => refetch({ id, filter: formatToStartsWith(filter) }), 250);

  const onAddSubmit = (formData: ManageProductForm) => {
    insertProduct({
      variables: { makerId: id, ...formData },
    });
  };

  const onEditSubmit = (formData: ManageProductForm) => {
    editProduct({
      variables: { id: currentProductId, ...formData },
    });
    if (currentProductId && picture)
      uploadPhoto(picture, generateFileName(`${currentProductId}`)).then(() => {
        handleAddOnClose();
        setPicture(null);
        toast({
          title: 'Se ha guardado tu producto de forma exitosa!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      });
    refetch();
    editModalOnClose();
  };

  const handleEdit = (id: number) => {
    setCurrentProductId(id);
    editModalOnOpen();
  };

  const handleFilterChange = (newValue: string) => {
    setFilter(newValue);
  };

  const handleAddOnClose = useCallback(() => {
    resetAddModal();
    addModalOnClose();
  }, [addModalOnClose, resetAddModal]);

  const handleEditOnClose = () => {
    resetEditModal();
    editModalOnClose();
  };

  const handleDelete = (id: number) => {
    deleteProduct({ variables: { id } });
    refetch();
  };

  useEffect(() => {
    getProduct();
  }, [currentProductId, getProduct]);

  useEffect(() => {
    if (!insertResult || !picture) return;
    const productId = insertResult.insert_product_one.id;
    uploadPhoto(picture, generateFileName(productId)).then(() => {
      handleAddOnClose();
      setPicture(null);
      toast({
        title: 'Se ha guardado tu producto de forma exitosa!',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      refetch();
    });
  }, [insertResult, picture, handleAddOnClose, toast, refetch]);

  if (error) return <ErrorPage route={`/`} />;

  return (
    <Layout activeHeader={MY_BUSINESS_SECTIONS.PRODUCTS}>
      <Box>
        <>
          <ManageProductModal
            isOpen={addModalIsOpen}
            handleOnClose={handleAddOnClose}
            onSubmit={handleAddModalSubmit(onAddSubmit)}
            errors={addModalErrors}
            register={registerAddModal}
            setPicture={setPicture}
          />
          <ManageProductModal
            isOpen={editModalIsOpen}
            handleOnClose={handleEditOnClose}
            product={currentProduct && currentProduct.product_by_pk}
            loading={loadingGetProduct}
            onSubmit={handleEditModalSubmit(onEditSubmit)}
            errors={editModalErrors}
            register={registerEditModal}
            setPicture={setPicture}
          />
          <Flex mt="20px">
            <FormLabel color="brandBlue" pt="5px">
              Buscar por nombre
            </FormLabel>
            <Input
              w="20%"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              onBlur={debouncedSearch}
            />
            <Spacer />
            <Button variant="solid" colorScheme="facebook" onClick={addModalOnOpen}>
              Agregar Producto
            </Button>
          </Flex>
        </>
        <>
          {loadingProducts ? (
            <LoadingPage />
          ) : (
            <>
              {productsHasResults ? (
                <Table variant="striped" colorScheme="gray" mt="2%">
                  <Thead>
                    <Tr>
                      <Th>Nombre del Producto</Th>
                      <Th>Fecha de Actualizacion</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.product.map((product: Product) => (
                      <Tr key={product.id}>
                        <Td>{product.name}</Td>
                        <Td>{product.updated_at}</Td>
                        <Td>
                          <EditIcon
                            color="facebook"
                            mr="20px"
                            cursor="pointer"
                            onClick={() => handleEdit(product.id)}
                          />
                          <CloseIcon color="red" cursor="pointer" onClick={() => handleDelete(product.id)} />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <EmptyResults />
              )}
              <PaginationButtons
                currentPage={currentPage}
                hasResults={productsHasResults}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </>
      </Box>
    </Layout>
  );
};

export default Catalog;
