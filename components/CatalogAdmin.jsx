import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
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
import { DELETE_PRODUCT_BY_ID, EDIT_PRODUCT_BY_ID, INSERT_PRODUCT } from '../graphql/mutations';
import { GET_PRODUCTS_BY_MAKER_ID, GET_PRODUCT_BY_ID } from '../graphql/queries';
import { formatToStartsWith } from '../graphql/utils';
import { EmptyResults, ErrorPage, LoadingPage, ManageProductModal } from '.';

const CatalogAdmin = ({ id }) => {
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentProductId, setCurrentProductId] = useState();
  const toast = useToast();
  const { isOpen: addModalIsOpen, onOpen: addModalOnOpen, onClose: addModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalOnOpen, onClose: editModalOnClose } = useDisclosure();
  const {
    handleSubmit: handleAddModalSubmit,
    register: registerAddModal,
    formState: { errors: addModalErrors },
    reset: resetAddModal,
  } = useForm();

  const {
    handleSubmit: handleEditModalSubmit,
    register: registerEditModal,
    formState: { errors: editModalErrors },
    reset: resetEditModal,
  } = useForm();

  const { data, loading: loadingProducts, error, refetch } = useQuery(GET_PRODUCTS_BY_MAKER_ID, { variables: { id } });
  const [getProduct, { loading: loadingGetProduct, data: currentProduct }] = useLazyQuery(GET_PRODUCT_BY_ID, {
    variables: { id: currentProductId },
  });

  const productsHasResults = data.product.length > 0;

  const [insertProduct] = useMutation(INSERT_PRODUCT, {
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
        title: 'Tu producto se guardo con exito.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetch();
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
      toast({
        title: 'Tu producto se guardo con exito.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetch();
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

  const onAddSubmit = (formData) => {
    insertProduct({
      variables: { makerId: id, ...formData },
    });
    handleAddOnClose();
  };

  const onEditSubmit = (formData) => {
    editProduct({
      variables: { id: currentProductId, ...formData },
    });
    editModalOnClose();
  };

  const handleEdit = (id) => {
    setCurrentProductId(id);
    editModalOnOpen();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleAddOnClose = () => {
    resetAddModal();
    addModalOnClose();
  };

  const handleEditOnClose = () => {
    resetEditModal();
    editModalOnClose();
  };

  const handleDelete = (id) => {
    deleteProduct({ variables: { id } });
    refetch();
  };

  useEffect(() => {
    debouncedSearch();
    setCurrentPage(0);
  }, [filter]);

  useEffect(() => {
    getProduct();
  }, [currentProductId]);

  useEffect(() => refetch({ offset: data.product.length * currentPage }), [currentPage]);

  if (error) return <ErrorPage route={`myBusiness/${id}`} />;

  return (
    <Box>
      <>
        <ManageProductModal
          isOpen={addModalIsOpen}
          handleOnClose={handleAddOnClose}
          onSubmit={handleAddModalSubmit(onAddSubmit)}
          errors={addModalErrors}
          register={registerAddModal}
        />
        <ManageProductModal
          isOpen={editModalIsOpen}
          handleOnClose={handleEditOnClose}
          product={currentProduct && currentProduct.product_by_pk}
          loading={loadingGetProduct}
          onSubmit={handleEditModalSubmit(onEditSubmit)}
          errors={editModalErrors}
          register={registerEditModal}
        />
        <Flex mt="20px">
          <FormLabel color="brandBlue" pt="5px">
            Buscar por nombre
          </FormLabel>
          <Input w="20%" value={filter} onChange={handleFilterChange} onBlur={debouncedSearch} />
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
                  {data.product.map((product) => (
                    <Tr key={product.id}>
                      <Td>{product.name}</Td>
                      <Td>{product.updated_at}</Td>
                      <Td>
                        <EditIcon color="facebook" mr="20px" cursor="pointer" onClick={() => handleEdit(product.id)} />
                        <CloseIcon color="red" cursor="pointer" onClick={() => handleDelete(product.id)} />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <EmptyResults />
            )}
            <Flex mt="5px">
              {currentPage > 0 && (
                <Button
                  size="md"
                  variant="outline"
                  colorScheme="facebook"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Anterior
                </Button>
              )}
              <Spacer />
              {productsHasResults && (
                <Button variant="solid" colorScheme="facebook" onClick={() => setCurrentPage((prev) => prev + 1)}>
                  Siguiente
                </Button>
              )}
            </Flex>
          </>
        )}
      </>
    </Box>
  );
};

export default CatalogAdmin;
