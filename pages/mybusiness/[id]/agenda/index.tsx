import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import Calendar from 'react-calendar';
import { ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Flex,
  Tooltip,
  useDisclosure,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_QUESTIONS_BY_MAKER_ID } from '@/graphql/queries';
import { UPDATE_QUESTION_BY_ID } from '@/graphql/mutations';
import { usePagination } from '@/hooks/index';
import { ErrorPage, LoadingPage, PaginationButtons, EmptyResults } from '@/components/common';
import { Layout } from '@/components/myBusiness';
import { MY_BUSINESS_SECTIONS } from '@/utils/constants';

const Questions = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data, loading, refetch, error } = useQuery(GET_QUESTIONS_BY_MAKER_ID, { variables: { id } });
  const { currentPage, setCurrentPage } = usePagination(data, refetch);

  //   const [getQuestion, { loading: loadingQuestion, data: question }] = useLazyQuery(GET_QUESTION_BY_ID, {
  //     variables: { id: currentQuestionId },
  //   });

  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  if (error) return <ErrorPage route={`/`} />;

  if (loading)
    return (
      <Layout activeHeader={MY_BUSINESS_SECTIONS.AGENDA}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MY_BUSINESS_SECTIONS.AGENDA}>
      <Box w="100%" h="100vh" bg="white" p="5%" pt="5%" alignContent="center">
        <Stack>
          {/* <Calendar onClickDay={setSelectedDate} value={selectedDate} /> */}
          <Divider />
          <Box>
            {true ? (
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Producto</Th>
                    <Th>Cantidad</Th>
                    <Th></Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody></Tbody>
              </Table>
            ) : (
              <EmptyResults />
            )}
            <PaginationButtons currentPage={currentPage} hasResults={true} setCurrentPage={setCurrentPage} />
          </Box>
        </Stack>
      </Box>
    </Layout>
  );
};
export default Questions;
