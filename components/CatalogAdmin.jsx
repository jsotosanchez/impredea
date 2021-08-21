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

import LoadingPage from './LoadingPage';
import { useGetProductsByMakerId } from '../graphql/hooks';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { DELETE_PRODUCT_BY_ID, EDIT_PRODUCT_BY_ID, INSERT_PRODUCT } from '../graphql/mutations';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT_BY_ID } from '../graphql/queries';
import ManageProductModal from './ManageProductModal';

const CatalogAdmin = ({ id }) => {
  const { data: productsByMakerId, loading, refetch } = useGetProductsByMakerId(id);
  const [filter, setFilter] = useState('');
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

  const [currentProductId, setCurrentProductId] = useState();
  const [getProduct, { loading: loadingGetProduct, data: currentProduct }] = useLazyQuery(GET_PRODUCT_BY_ID, {
    variables: { id: currentProductId },
  });

  useEffect(() => {
    getProduct();
  }, [currentProductId]);

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

  const handleEdit = (id) => {
    setCurrentProductId(id);
    editModalOnOpen();
  };

  const handleOnChange = (e) => setFilter(e.target.value);

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
  if (loading) return <LoadingPage />;

  return (
    <Box>
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
        <Input w="20%" value={filter} onChange={handleOnChange} />
        <Spacer />
        <Button variant="solid" colorScheme="facebook" onClick={addModalOnOpen}>
          Agregar Producto
        </Button>
      </Flex>
      <Table variant="striped" colorScheme="gray">
        <TableCaption placement="top">Mi Catalogo:</TableCaption>
        <Thead>
          <Tr>
            <Th>Producto</Th>
            <Th>Fecha de Actualizacion</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productsByMakerId.products.map((product) => (
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
    </Box>
  );
};

export default CatalogAdmin;
