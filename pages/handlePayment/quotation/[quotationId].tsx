import { SessionContext } from '@/context/sessionContext';
import { ACCEPT_QUOTATION, CREATE_SALE } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { Center, Heading } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

interface Props {}
const HandleQuotationPayment = ({}: Props): JSX.Element => {
  const context = useContext(SessionContext);
  const currentUser = context.getUser();
  const toast = useToast();
  const router = useRouter();
  const { quotationId, status, payment_id } = router.query;

  const [createSale] = useMutation(CREATE_SALE, {
    onCompleted: () => {
      toast({
        title: 'Se realizo la compra exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push(`myPurchases/${currentUser?.id}/purchases`);
    },
  });

  const [acceptQuotation, { data: acceptQuotationResponse }] = useMutation(ACCEPT_QUOTATION);

  useEffect(() => {
    if (acceptQuotationResponse) {
      const { client_id, maker_id, id } = acceptQuotationResponse.update_quotations_by_pk;
      createSale({ variables: { client_id, maker_id, id, paymentId: payment_id } });
    }
  }, [acceptQuotationResponse, createSale, payment_id]);

  useEffect(() => {
    if (status === 'approved') acceptQuotation({ variables: { id: quotationId } });
  }, [acceptQuotation, quotationId, status]);

  if (status === 'approved')
    return (
      <Center>
        {' '}
        <Heading> Estamos procesando tu pago...</Heading>
      </Center>
    );

  return (
    <Center>
      {' '}
      <Heading> Ha ocurido un error con tu pago, por favor intenta mas tarde</Heading>
    </Center>
  );
};

export default HandleQuotationPayment;
